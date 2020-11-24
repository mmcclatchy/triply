from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Stop, GasStation, db
from app.utils import normalize, snake_case
from sqlalchemy.exc import SQLAlchemyError

gas_station_routes = Blueprint('gas_stations', __name__, url_prefix='/api')


# GET gas_station associated with a specific stop
@gas_station_routes.route('/stops/<int:stop_id>/gas_station', methods=['GET'])
@login_required
def get_gas_station(stop_id):
    try:
        gas_station = GasStation.query.\
            filter(GasStation.id == Stop.gas_station_id).\
            filter(Stop.id == stop_id).first()
        gas_station_json = jsonify({'gas_stations': normalize(gas_station)})
        return gas_station_json
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        return {'errors': ['An error occurred while retrieving the data']}, 500


# POST a specific gas_station
@gas_station_routes.route('/gas_stations', methods=['POST'])
@login_required
def post_gas_station():
    data = request.data
    try:
        gas_station = GasStation(
            name=data.name,
            place_id=data.placeId)
        db.session.add(gas_station)
        db.session.commit()
        return {'gasStations': normalize(gas_station)}
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        return {'errors': ['An error occurred while retrieving the data']}, 500


# DELETE a specific gas_station
@gas_station_routes.route('/gas_stations/<int:gas_station_id>',
                          methods=['DELETE'])
@login_required
def delete_gas_station(gas_station_id):
    gas_station = GasStation.query.get(gas_station_id)
    if gas_station:
        db.session.delete(gas_station)
        db.session.commit()
        return {'message': f'\
            Gas Station Id: {gas_station_id} was successfully deleted'}
    else:
        return {'errors': [f'Gas Station Id: {gas_station_id} was not found']}
