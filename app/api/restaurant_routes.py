from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Stop, Restaurant, Cuisine, restaurant_cuisines, db
from app.utils import normalize, snake_case
from sqlalchemy.exc import SQLAlchemyError

restaurant_routes = Blueprint('restaurants', __name__)


# GET all restaurants
@restaurant_routes.route('/restaurants', methods=['GET'])
@login_required
def get_restaurants():
    restaurants = Restaurant.query.all()
    rest_list = [restaurant.to_dict() for restaurant in restaurants]
    return {{'payload': normalize(rest_list)}}


# GET restaurant associated with a specific stop
@restaurant_routes.route('/stops/<int:stop_id>/restaurant', methods=['GET'])
@login_required
def get_restaurant(stop_id):
    restaurant = Restaurant.query.\
        filter(Restaurant.id == Stop.restaurant_id).\
        filter(Stop.id == stop_id).first()
    if not restaurant:
        return {}, 404
    restaurant_json = jsonify({
        'payload': normalize(restaurant.to_dict())
    })
    return restaurant_json


# POST a specific restaurant
@restaurant_routes.route('/restaurants', methods=['POST'])
@login_required
def post_restaurant():
    data = request.json

    try:
        restaurant = Restaurant(
            name=data['name'],
            phone_num=data['phoneNum'],
            street_address=data['streetAddress'],
            city=data['city'],
            state=data['state'],
            zip_code=data['zipCode'],
            img_url=data['imgUrl'],
            place_id=data['placeId'])

        for cuisine in data['cuisines']:
            c = Cuisine.query.filter(Cuisine.name == cuisine).first()
            if isinstance(c, Cuisine):
                restaurant.cuisines.append(c)
            else:
                cuisine_type = Cuisine(name=cuisine)
                restaurant.cuisines.append(cuisine_type)

        db.session.add(restaurant)
        db.session.commit()
        return {'restaurants': normalize(restaurant.to_dict())}

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        return {'errors': ['An error occurred while retrieving the data']}, 500


# DELETE a specific restaurant
@restaurant_routes.route('/restaurants/<int:rest_id>',
                         methods=['DELETE'])
@login_required
def delete_restaurant(rest_id):
    restaurant = Restaurant.query.get(rest_id)
    if restaurant:
        db.session.delete(restaurant)
        db.session.commit()
        return {
            'message': f'Restaurant Id: {rest_id} was successfully deleted'}
    else:
        return {'errors': [f'Restaurant Id: {rest_id} was not found']}
