from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Stop, Cuisine, db
from app.utils import normalize, snake_case
from sqlalchemy.exc import SQLAlchemyError

cuisine_routes = Blueprint('cuisines', __name__)


# GET cuisine associated with a specific stop
@cuisine_routes.route('/stops/<int:stop_id>/cuisine', methods=['GET'])
@login_required
def get_cuisine(stop_id):
    try:
        cuisine = Cuisine.query.\
            filter(Cuisine.id == Stop.cuisine_id).\
            filter(Stop.id == stop_id).first()
        cuisine_json = jsonify({'cuisines': normalize(cuisine)})
        return restaurant_json
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        return {'errors': ['An error occurred while retrieving the data']}, 500


# POST a specific cuisine
@cuisine_routes.route('/cuisines', methods=['POST'])
@login_required
def post_cuisine():
    data = request.data
    try:
        cuisine = cuisine(
            name=data.name,
            place_id=data.placeId)
        db.session.add(cuisine)
        db.session.commit()
        return {'cuisines': normalize(cuisine)}
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        return {'errors': ['An error occurred while retrieving the data']}, 500


# DELETE a specific cuisine
@cuisine_routes.route('/cuisines/<int:cuisine_id>', methods=['DELETE'])
@login_required
def delete_cuisine(cuisine_id):
    cuisine = cuisine.query.get(cuisine_id)
    if cuisine:
        db.session.delete(cuisine)
        db.session.commit()
        return {'message': f'Cuisine Id: {cuisine_id} was successfully \
            deleted'}
    else:
        return {'errors': [f'Cuisine Id: {cuisine_id} was not found']}
