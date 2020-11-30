from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Trip, User, Car, db
from app.utils import (
    normalize, snake_case, get_place_coords, coords_to_str,
    get_food_preference
)
from sqlalchemy.exc import SQLAlchemyError
from ..Trip import TripClass


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
@trip_routes.route('/users/<int:user_id>/trips', methods=['POST'])
@login_required
def post_trip(user_id):
    data = request.json
    origin = get_place_coords(data['startLocation'])
    destination = get_place_coords(data['endLocation'])
    car = Car.query.filter(Car.id == data['carId']).first()

    trip_algo = TripClass(
        travelPerDay=data['dailyTimeLimit'],
        travelPerIncrement=data['stopTimeLimit'],
        milesTillFuelNeeded=car.miles_to_refuel,
        avoidTolls=data['avoidTolls']
    )
    trip_algo.setStartLocationFromString(data['startLocation'])
    trip_algo.setEndLocationFromString(data['endLocation'])

    trip_algo.createDirection()
    trip_dict = trip_algo.toDictForDatabase()

    trip = Trip(
        user_id=data['userId'],
        name=f'{data['startLocation']} - {data['endLocation']}',
        car_id=car.id,
        toll=trip_dict['toll'],
        daily_time_limit=trip_dict['daily_time_limit'],
        stop_time_limit=trip_dict['stop_time_limit'],
        start_time=trip_dict['startTime'],
        start_location=coords_to_str(trip_dict['start_location']),
        end_time=trip_dict['end_time'],
        end_location=coords_to_str(trip_dict['end_location']),
        directions=trip_dict['directions']
    )

    food_pref, hotel_pref, gas_pref = get_preferences(getdata['foodQuery'])
    suggestions = trip_algo.getNextStopDetails(
        foodQuery=food_preference,
        hotel=hotel_pref,
        gas=gas_pref)

    try:
        db.session.add(trip)
        db.session.commit()
        trip_json = jsonify({
            'payload': {'trips': normalize(trip.to_dict())},
            'suggestions': suggestions
        })
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

        if data['startTime'] | data['endTime']:
            trip_instance = TripClass(
                startCor=origin,
                endCor=destination,
            )
            trip_instance.createDirection()

        trip_instance.getDirections()
        trip['directions'] = trip_instance['directions']

        db.session.commit()
        trip_json = jsonify({
            'payload': {'trips': normalize(trip.to_dict())},
            'directions': normalize(trip.directions_to_dict())
        })
        return trip_json

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        db.session.rollback()
        return {'errors': ['An error occurred while retrieving the data']}, 500


# DELETE a specific trip
@trip_routes.route('/trips/<int:trip_id>', methods=['DELETE'])
@login_required
def delete_trip(trip_id):
    trip = Trip.query.filter(Trip.id == trip_id).first()

    if trip:
        db.session.delete(trip)
        db.session.commit()
        return {'id': trip_id}

    else:
        return {'errors': [f'Trip Id: {trip_id} was not found']}, 404


# GET the stop timeline associated with a trip
@trip_routes.route('/trips/<int:trip_id>/timeline', methods=['GET'])
@login_required
def get_timeline(trip_id):
    trip = Trip.query.filter(Trip.id == trip_id).first()
    if trip:
        return {'directions': {'timeline': trip.get_time_line()}}
    else:
        return {}, 404
