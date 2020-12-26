from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Trip, Stop, Cuisine, Restaurant, GasStation, Hotel, db
from app.utils import (
    normalize, snake_case, coords_from_str, create_place_id_list,
    create_stop_keys, coords_to_str,
)
from sqlalchemy.exc import SQLAlchemyError
from ..Trip2 import TripClass


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
@stop_routes.route('/trips/<int:trip_id>/stops', methods=['POST'])
@login_required
def post_stop(trip_id):
    data = request.json

    # Find the trip in which this stop is associated
    trip = Trip.query.filter(Trip.id == trip_id).first()

    # If the place ids include a hotel, send suggestions
    # for food and gas based on the location of the hotel
    # if any([place for place in data['places'] if place['type'] == 'hotel']):
    #     trip_algo = TripClass()
    #     food_and_gas = trip_algo.getFoodAndGasNearLocation(
    #         food_pref, hotel['placeId']
    #     )
    #     return jsonify({
    #         'suggestions': {'suggestions': food_and_gas, 'hotel': hotel}
    #     })

    trip_algo = TripClass()

    # Reconstruct algorithm from the directions of the Trip
    trip_algo.createFromJson(trip.directions)

    if data['restaurant']:
        trip_algo.addFood(data['restaurant'])

    if data['gasStation']:
        trip_algo.addGasStation(data['gasStation'])

    # ! Hotels are being skipped over for now
    if data['hotel']:
        trip_algo.addHotel(data['hotel'])

    # If a hotel was chosen prior to the food and/or gas,
    # add the hotel to place_ids and stop_keys
    # if data['hotel']:
    #     place_ids = [data['hotel']] + place_ids
    #     stop_keys = ['h'] + stop_keys
    # ! ------------------------------------

    food_query = data['foodQuery']
    food_pref = food_query[len(food_query) % data['tripStopNum']]

    try:

        if data['restaurant']:
            req_rest = data['restaurant']
            
            if 'photoUrl' in req_rest.keys():
                rest_photo_url = req_rest['photoUrl']
            else:
                rest_photo_url = None
                
            cuisine = Cuisine(name=food_pref)
            restaurant = Restaurant(
                name=req_rest['name'],
                coordinates=coords_to_str(req_rest['geometry']['location']),
                img_url=rest_photo_url,
                place_id=req_rest['place_id'],
            )
            restaurant.cuisines.append(cuisine)
            db.session.add(restaurant)

        if data['gasStation']:
            req_gas = data['gasStation']
            
            if 'photoUrl' in req_gas.keys():
                gas_photo_url = req_gas['photoUrl']
            else:
                gas_photo_url = None
                
            gas_station = GasStation(
                name=req_gas['name'],
                coordinates=coords_to_str(req_gas['geometry']['location']),
                img_url=gas_photo_url,
                place_id=req_gas['place_id'],
            )
            db.session.add(gas_station)

        if data['hotel']:
            req_hotel = data['hotel']
            
            if 'photoUrl' in req_hotel.keys():
                hotel_photo_url = req_hotel['photoUrl']
            else:
                hotel_photo_url = None
                
            hotel = Hotel(
                name=req_hotel['name'],
                coordinates=coords_to_str(req_hotel['geometry']['location']),
                img_url=hotel_photo_url,
                place_id=req_hotel['place_id'],
            )
            db.session.add(hotel)

        restaurant_id = restaurant.id if data['restaurant'] else None
        gas_station_id = gas_station.id if data['gasStation'] else None
        hotel_id = hotel.id if data['hotel'] else None

        stop = Stop(
            trip_id=data['tripId'],
            trip_stop_num=data['tripStopNum'],
            coordinates=data['coordinates'],
            time=data['time'],
            restaurant_id=restaurant_id,
            gas_station_id=gas_station_id,
            hotel_id=hotel_id,
            star_min=data['starMin'],
            star_max=data['starMax'])

        # for cuisine in data['cuisines']:
        #     c = Cuisine.query.filter(Cuisine.name == cuisine).first()
        #     if isinstance(c, Cuisine):
        #         stop.cuisines.append(c)
        #     else:
        #         cuisine_type = Cuisine(name=cuisine)
        #         stop.cuisines.append(cuisine_type)

        # Determine cuisine based on preferences and what has already been eaten

        db.session.add(stop)
        db.session.commit()
        stop_info = {
            # 'payload': {'stops': normalize(stop.to_dict())}
            'suggestions': trip_algo.getNextStopDetails(foodQuery=food_pref),
            'directions': trip_algo.getDirections(),
        }
        stop_json = jsonify(stop_info)
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
