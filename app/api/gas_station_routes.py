from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Stop, GasStation, db
from app.utils import normalize, snake_case
from sqlalchemy.exc import SQLAlchemyError

gas_station_routes = Blueprint('gas_stations', __name__)


# GET all gas_stations
@gas_station_routes.route('/gas_stations', methods=['GET'])
@login_required
def get_gas_stations():
    gas_stations = GasStation.query.all()
    if not gas_stations:
        return {}, 404
    gas_list = [gas_station.to_dict() for gas_station in gas_stations]
    return {'gasStations': normalize(gas_list)}


# GET gas_station associated with a specific stop
@gas_station_routes.route('/stops/<int:stop_id>/gas_station', methods=['GET'])
@login_required
def get_gas_station(stop_id):
    gas_station = GasStation.query.\
        filter(GasStation.id == Stop.gas_station_id).\
        filter(Stop.id == stop_id).first()
    if not gas_station:
        return {}, 404
    gas_station_json = jsonify({
        'gasStations': normalize(gas_station.to_dict())
    })
    return gas_station_json


# POST a specific gas_station
@gas_station_routes.route('/gas_stations', methods=['POST'])
@login_required
def post_gas_station():
    data = request.json

    try:
        gas_station = GasStation(
            name=data['name'],
            phone_num=data['phoneNum'],
            street_address=data['streetAddress'],
            city=data['city'],
            state=data['state'],
            zip_code=data['zipCode'],
            img_url=data['imgUrl'],
            place_id=data['placeId'])
        db.session.add(gas_station)
        db.session.commit()
        return {'gasStations': normalize(gas_station.to_dict())}
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
