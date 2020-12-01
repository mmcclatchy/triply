from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Trip, Stop, Cuisine, db
from app.utils import (
    normalize, snake_case, coords_from_str, create_place_id_list,
    create_stop_keys, get_places
)
from sqlalchemy.exc import SQLAlchemyError
from ..Trip import TripClass


stop_routes = Blueprint('stops', __name__)


# GET all stops associated with a trip
@stop_routes.route('trips/<int:trip_id>/stops/', methods=['GET'])
@login_required
def get_stops(trip_id):
    stops = Stop.query.filter(Stop.trip_id == trip_id).all()
    if stops:
        return {'payload': normalize([stop.to_dict() for stop in stops])}
    else:
        return {}, 404


# GET a specific stop
@stop_routes.route('stops/<int:stop_id>', methods=['GET'])
@login_required
def get_stop(stop_id):
    stop = Stop.query.get(stop_id)
    if stop:
        return {'payload': normalize(stop.to_dict())}
    else:
        return {}, 404


# POST a new stop for a specific trip
@stop_routes.route('/trips/<int:trip_id>/stops/', methods=['POST'])
@login_required
def post_stop(trip_id):
    data = request.json

    # Find the trip in which this stop is associated
    trip = Trip.query.filter(Trip.id == trip_id).first()

    # Extract the places from data and assign them the correct variables
    restaurant, gas, hotel = get_places(data)

    # Determine cuisine based on preferences and what has already been eaten
    food_preference = trip.next_cuisine_option(data['cuisines'])

    # If the place ids include a hotel, send suggestions
    # for food and gas based on the location of the hotel
    if any([place for place in data['places'] if place['type'] == 'hotel']):
        trip_algo = TripClass()
        food_and_gas = trip_algo.getFoodAndGasNearLocation(
            food_preference, hotel['placeId']
        )
        return jsonify({
            'suggestions': {'suggestions': food_and_gas, 'hotel': hotel}
        })

    # Construct a instance of the Trip Algorithm
    trip_algo = TripClass(
        startCor=coords_from_str(trip.start_location),
        endCor=coords_from_str(trip.end_location),
        travelPerDay=trip.daily_time_limit,
        travelPerIncrement=trip.stop_time_limit,
        milesTillFuelNeeded=trip.car.miles_to_refuel,
        avoidTolls=trip.tolls
    )

    # Reconstruct the directions of the Trip
    trip_algo.constructFromDirections(trip.directions)

    # Get the Google Maps Place Ids and create a list that keeps track
    # of each waypoint type (gas, restaurant, and/or hotel)
    places = create_place_id_list(data)
    stop_keys = create_stop_keys(data)

    # If a hotel was chosen prior to the food and/or gas,
    # add the hotel to place_ids and stop_keys
    if data['hotel']:
        place_ids = [data['hotel']] + place_ids
        stop_keys = ['h'] + stop_keys

    # Create a new stop along the route based off the selections
    trip_algo.addStop(place_ids, stop_keys)

    try:
        stop = Stop(
            trip_id=data['tripId'],
            trip_stop_num=data['tripStopNum'],
            restaurant=restaurant,
            hotel=hotel,
            gas_station=gas,
            coordinates=data['coordinates'],
            time=data['time'],
            star_min=data['starMin'],
            star_max=data['starMax'])

        # for cuisine in data['cuisines']:
        #     c = Cuisine.query.filter(Cuisine.name == cuisine).first()
        #     if isinstance(c, Cuisine):
        #         stop.cuisines.append(c)
        #     else:
        #         cuisine_type = Cuisine(name=cuisine)
        #         stop.cuisines.append(cuisine_type)

        db.session.add(stop)
        db.session.commit()
        stop_json = jsonify({
            'payload': {'stops': normalize(stop.to_dict())}})
        return stop_json

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        db.session.rollback()
        return {'errors': ['An error occurred while retrieving the data']}, 500


# PUT (Modify) a specific stop
@stop_routes.route('/stops/<int:stop_id>', methods=['PUT'])
@login_required
def put_stop(stop_id):
    data = request.json
    try:
        stop = Stop.query.get(stop_id)
        
        for key in data:
            
            if key == 'cuisines':
                for cuisine in data['cuisines']:
                    c = Cuisine.query.filter(Cuisine.name == cuisine).first()
                    if isinstance(c, Cuisine):
                        stop.cuisines.append(c)
                    else:
                        cuisine_type = Cuisine(name=cuisine)
                        stop.cuisines.append(cuisine_type)
            else:
                stop[snake_case(key)] = data[key]

        db.session.commit()
        return {'stops': normalize(stop.to_dict())}

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        db.session.rollback()
        return {'errors': ['An error occurred while retrieving the data']}, 500


# DELETE a specific stop
@stop_routes.route('/stops/<int:stop_id>', methods=['DELETE'])
@login_required
def delete_stop(stop_id):
    stop = Stop.query.get(stop_id)
    if stop:
        db.session.delete(stop)
        db.session.commit()
        return {'message': f'Stop Id: {stop_id} was successfully deleted'}
    else:
        return {'errors': [f'Stop Id: {stop_id} was not found']}, 404


################################################################
#                       Helper Functions
################################################################

