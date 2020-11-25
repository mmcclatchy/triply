from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Trip, User, db
from app.utils import normalize, snake_case
from sqlalchemy.exc import SQLAlchemyError

trip_routes = Blueprint('trips', __name__)


# GET all trips associated with a specific user
@trip_routes.route('/users/<int:user_id>/trips', methods=['GET'])
@login_required
def get_trips(user_id):
    try:
        trips = Trip.query.filter(Trip.user_id == user_id).all()
        trip_dicts = [trip.to_dict() for trip in trips]
        trips_json = jsonify({'trips': normalize(trip_dicts)})
        return trips_json
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        return {'errors': ['An error occurred while retrieving the data']}, 500


# GET a specific trip associated for a user
@trip_routes.route('/trips/<int:trip_id>', methods=['GET'])
@login_required
def get_trip(trip_id):
    try:
        trip = Trip.query.filter(Trip.id == trip_id).first()
        trip_json = jsonify({'trips': normalize(trip.to_dict())})
        return trip_json
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        return {'errors': ['An error occurred while retrieving the data']}, 500


# POST a trip associated with a user
@trip_routes.route('/users/<int:user_id>/trips/', methods=['POST'])
@login_required
def post_trip(user_id):
    data = request.json
    trip = Trip(
        user_id=data['userId'],
        name=data['name'],
        car_id=data['carId'],
        toll=data['toll'],
        daily_time_limit=data['dailyTimeLimit'],
        stop_time_limit=data['stopTimeLimit'],
        start_time=data['startTime'],
        start_location=data['startLocation'],
        end_time=data['endTime'],
        end_location=data['endLocation'])
    try:
        db.session.add(trip)
        db.session.commit()
        trip_json = jsonify({'trips': normalize(trip.to_dict())})
        return trip_json
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        db.session.rollback()
        return {'errors': ['An error occurred while retrieving the data']}, 500


# PUT (Modify) an existing trip
@trip_routes.route('/trips/<int:trip_id>', methods=['PUT'])
@login_required
def modify_trip(trip_id):
    data = request.json
    try:
        trip = Trip.query.get(trip_id)
        for key, value in data.items():
            setattr(trip, key, value)
        db.session.commit()
        return {'trips': normalize(trip.to_dict())}
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        db.session.rollback()
        return {'errors': ['An error occurred while retrieving the data']}, 500


# DELETE a specific trip
@trip_routes.route('/trips/<int:trip_id>', methods=['DELETE'])
@login_required
def delete_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if trip:
        db.session.delete(trip)
        db.session.commit()
        return {'message': f'Trip Id: {trip_id} was successfully deleted'}
    else:
        return {'errors': [f'Trip Id: {trip_id} was not found']}, 404
