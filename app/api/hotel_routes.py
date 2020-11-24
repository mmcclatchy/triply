from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Stop, Hotel, db
from app.utils import normalize, snake_case
from sqlalchemy.exc import SQLAlchemyError

hotel_routes = Blueprint('hotels', __name__, url_prefix='/api')


# GET hotel associated with a specific stop
@hotel_routes.route('/stops/<int:stop_id>/hotel', methods=['GET'])
@login_required
def get_hotel(stop_id):
    try:
        hotel = Hotel.query.\
            filter(Hotel.id == Stop.hotel_id).\
            filter(Stop.id == stop_id).first()
        hotel_json = jsonify({'hotels': normalize(hotel)})
        return restaurant_json
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        return {'errors': ['An error occurred while retrieving the data']}, 500


# POST a specific hotel
@hotel_routes.route('/hotels', methods=['POST'])
@login_required
def post_hotel():
    data = request.data
    try:
        hotel = Hotel(
            name=data.name,
            place_id=data.placeId)
        db.session.add(hotel)
        db.session.commit()
        return {'hotels': normalize(hotel)}
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        return {'errors': ['An error occurred while retrieving the data']}, 500


# DELETE a specific hotel
@hotel_routes.route('/hotels/<int:hotel_id>', methods=['DELETE'])
@login_required
def delete_hotel(hotel_id):
    hotel = Hotel.query.get(hotel_id)
    if hotel:
        db.session.delete(hotel)
        db.session.commit()
        return {'message': f'Hotel Id: {hotel_id} was successfully deleted'}
    else:
        return {'errors': [f'Hotel Id: {hotel_id} was not found']}
