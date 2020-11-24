from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Trip, Stop, db
from app.utils import normalize, snake_case

stop_routes = Blueprint('stops', __name__, url_prefix='/api')


# GET all stops associated with a trip
@stop_routes.route('trips/<int:trip_id>/stops/', methods=['GET'])
@login_required
def get_stops(trip_id):
    try:
        stops = Stop.query.filter(Stop.trip_id == trip_id).all()
        return {'stops': normalize(stops)}
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        return {'errors': ['An error occurred while retrieving the data']}, 500


# GET a specific stop
@stop_routes.route('stops/<int:stop_id>', methods=['GET'])
@login_required
def get_stop(stop_id):
    try:
        stop = Stop.query.get(stop_id)
        return {'stops': normalize(stop)}
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        return {'errors': ['An error occurred while retrieving the data']}, 500


# POST a new stop for a specific trip
@stop_routes.route('/trips/<int:trip_id>/stops/', methods=['POST'])
@login_required
def post_stop(trip_id):
    data = request.data
    try:
        stop = Stop(
            trip_id=data.tripId,
            trip_stop_num=data.tripStopNum,
            restaurant_id=data.restaurantId,
            hotel_id=data.hotelId,
            gas_id=data.gasId,
            coordinates=data.coordinates)
        db.session.add(stop)
        db.session.create()
        stop_json = jsonify({'stops': normalize(stop)})
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
    data = request.data
    try:
        stop = Stop.query.get(stop_id)
        for key in data:
            stop[snake_case(key)] = data[key]
        db.session.commit()
        return {'stops': normalize(stop)}
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
