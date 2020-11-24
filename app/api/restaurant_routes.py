from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Stop, Restaurant, db
from app.utils import normalize, snake_case
from sqlalchemy.exc import SQLAlchemyError

restaurant_routes = Blueprint('restaurants', __name__, url_prefix='/api')


# GET restaurant associated with a specific stop
@restaurant_routes.route('/stops/<int:stop_id>/restaurant', methods=['GET'])
@login_required
def get_restaurant(stop_id):
    try:
        restaurant = Restaurant.query.\
            filter(Restaurant.id == Stop.restaurant_id).\
            filter(Stop.id == stop_id).first()
        restaurant_json = jsonify({'restaurants': normalize(restaurant)})
        return restaurant_json
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        return {'errors': ['An error occurred while retrieving the data']}, 500


# POST a specific restaurant
@restaurant_routes.route('/restaurants', methods=['POST'])
@login_required
def post_restaurant():
    data = request.data
    try:
        restaurant = Restaurant(
            name=data.name,
            place_id=data.placeId)
        db.session.add(restaurant)
        db.session.commit()
        return {'restaurants': normalize(restaurant)}
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        return {'errors': ['An error occurred while retrieving the data']}, 500


# DELETE a specific restaurant
@restaurant_routes.route('/restaurants/<int:restaurant_id>',
                         methods=['DELETE'])
@login_required
def delete_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if restaurant:
        db.session.delete(restaurant)
        db.session.commit()
        return {'message': f'Restaurant Id: \
            {restaurant_id} was successfully deleted'}
    else:
        return {'errors': [f'Restaurant Id: {restaurant_id} was not found']}
