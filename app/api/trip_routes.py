from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Trip, User, db
from app.utils import normalize, snake_case

trip_routes = Blueprint('trips', __name__)


# GET all trips associated with a specific user
@trip_routes.route('/<int:user_id>/trips', methods=['GET'])
@login_required
def get_trips(user_id):
    trips = Trip.query.filter(Trip.user_id == user_id).all()
    if trips:
        trips_json = jsonify('trips': normalize(trips))
        return trips_json
    else:
        return {'errors': [f'No trips found for User Id: {user_id}']}


# GET a specific trip associated for a user
@trip_routes.route('/<int:trip_id>', methods=['GET'])
@login_required
def get_trip(trip_id):
    trip = Trip.query.filter(Trip.id == trip_id).first()
    if trip:
        trip_json = jsonify({'trips': normalize(trip)})
        return trip_json
    else:
        return {'errors': [f'Trip Id: {trip_id} was not found']}, 404


# POST a trip associated with a user
@trip_routes.route('/<int:user_id>/trips/', methods=['POST'])
@login_required
def post_trip(user_id):
    data = request.data
    trip = Trip(
        user_id=data.userId,
        name=data.name,
        car_id=data.carId,
        toll=data.toll,
        daily_time_limit=data.dailyTimeLimit,
        stop_time_limit=data.stopTimeLimit,
        start_time=data.startTime,
        start_location=data.startLocation,
        end_time=data.endTime,
        end_location=data.endLocation)
    try:
        db.session.add(trip)
        db.session.commit()
        trip_json = jsonify('trips': normalize(trip))
        return trip_json
    except TripCreationError:
        print(TripCreationError)
        return {'errors': ['Trip data was not valid']}, 400


# PUT (Modify) an existing trip
@trip_routes.route('/trips/<int:trip_id>', methods=['PUT'])
@login_required
def modify_trip(trip_id):
    data = request.data
    trip = Trip.query.get(trip_id)
    if trip:
        for key in data:
            trip[key] = data[key]
        db.session.commit()
        return {'trips': normalize(trip)}
    else:
        return {'errors': [f'Trip Id: {trip_id} was not found']}, 404


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