from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Trip, User, Car, db
from app.utils import (
    normalize, snake_case, coords_to_str, get_preferences,
    coords_from_str, get_places
)
from sqlalchemy.exc import SQLAlchemyError
from ..Trip2 import TripClass
import json


trip_routes = Blueprint('trips', __name__)


# GET all trips associated with a specific user
@trip_routes.route('/users/<int:user_id>/trips', methods=['GET'])
@login_required
def get_trips(user_id):

    try:
        trips = Trip.query.filter(Trip.user_id == user_id).all()
        trip_dicts = [trip.to_dict() for trip in trips]
        trips_json = jsonify({'payload': {'trips': normalize(trip_dicts)}})
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
        trip_json = jsonify({'payload': {'trips': normalize(trip.to_dict())}})
        return trip_json

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        return {'errors': ['An error occurred while retrieving the data']}, 500


# POST a trip associated with a user
@trip_routes.route('/users/<int:user_id>/trips', methods=['POST'])
@login_required
def post_trip(user_id):
    req = request.json
    data = req['db']

    # User's food preferences
    food_query = req['preferences']['foodQuery']

    # Convert miles to meters for distance per tank of selected car
    fuel_distance = round(data['milesToRefuel'] * 1609.34)

    origin = data['startLocation']
    destination = data['endLocation']

    print('***\n\nEnd Time: ', data['endTimeForDay'], '\n\n***')
    print('***\n\nEnd Time: ', data['dailyStartTime'], '\n\n***')
    # Create an instance of the trip algorithm and generate a new trip
    trip_algo = TripClass()
    directions_json = trip_algo.createNewTrip(
        start=origin,
        end=destination,
        metersToRefuel=fuel_distance,
        timeBetweenStops=int(data['timeBetweenStops']),
        endTimeForDay=data['endTimeForDay'],
        startISO=data['startISO'],  # + '00:000Z', # ! No Timezone
        avoidTolls=data['avoidTolls'],
        dailyStartTime=data['dailyStartTime']
    )

    # Create a model of the Trip for the DB
    trip = Trip(
        user_id=data['userId'],
        name=f'{origin} -> {destination}',
        car_id=data['carId'],
        directions=directions_json,
        start_location=origin,
        end_location=destination,
        start_iso=data['startISO']
    )

    # hotel_needed = True if data['endTimeForDay'] else False
    next_stop_suggestions = trip_algo.getNextStopDetails(
        foodQuery=food_query[0],
    )

    try:
        db.session.add(trip)
        db.session.commit()

        # Create a json object structured for Redux slices of state
        trip_json = jsonify({
            'payload': {
                'trips': normalize(trip.to_dict()),
                'currentTripId': trip.id
            },
            'suggestions': next_stop_suggestions,
            'directions': {
                'itinerary': trip.directions,
                'foodQuery': food_query,
                'avoidTolls': data['avoidTolls']
            }
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

    # Amend the Trip Model with attributes sent from Frontend for the DB
    trip = Trip.query.get(trip_id)
    for key, value in data['db'].items():
        setattr(trip, snake_case(key), value)

    # Query for the Trip's car
    car = Car.query.get(data['db']['carId'])

    # Recreate an instance of the Trip Algorithm
    trip_algo = TripClass(
        startCor=coords_from_str(trip.start_location),
        endCor=coords_from_str(trip.end_location),
        travelPerDay=data['db']['dailyTimeLimit'],
        travelPerIncrement=data['db']['stopTimeLimit'],
        milesToRefuel=car.miles_to_refuel,
        avoidTolls=data['db']['avoidTolls']
    )

    # Recreate the directions of the Algorithm
    trip_algo.constructFromDirections(trip.directions)

    # Get preferences and search next stop for places that match preferences
    # food_query, hotel, gas = get_preferences(data['preferences'])
    suggestions = trip_algo.getNextStopDetails(foodQuery=data['preferences']['foodQuery'][0],
                                               hotel=data.get('hotel'),
                                               gas=data.get('gas'))

    # Adjust the directions and save to the database model
    directions = trip_algo.getDirections()
    trip.directions = directions

    try:
        db.session.commit()
        trip_json = jsonify({
            'payload': {'trips': normalize(trip.to_dict()), 'currentId': trip.id},
            'suggestions': {'suggestions': suggestions},
            'timeline': trip.get_timeline()
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
