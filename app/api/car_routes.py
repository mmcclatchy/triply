from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Car, User, db
from app.utils import normalize

car_routes = Blueprint('cars', __name__)


# GET all cars owned by the specific user
@car_routes.route('/<int:user_id>/cars', methods=['GET'])
@login_required
def get_cars(user_id):
    cars = Car.query.filter(Car.user_id == user_id).all()
    if cars:
        return {'cars': normalize(cars)}
    else:
        return {'errors': [f'No cars found for User Id: {user_id}']}, 404


# GET a specific car
@car_routes.route('/cars/<int:car_id>', methods=['GET'])
@login_required
def get_car(car_id):
    car = Car.query.filter(Car.query.get(car_id))
    if car:
        car_json = jsonify({'cars': normalize(car)})
        return car_json
    else:
        return {'errors': [f'Car Id: {car_id} was not found']}, 404


# POST a new car for a specific user
@car_routes.route('/<int:user_id>/cars', methods=['POST'])
@login_required
def post_car(user_id):
    car = Car(user_id=user_id, vehicle_id=request.data.carId)
    try:
        db.session.add(car)
        db.session.commit()
        car_json = jsonify({'cars': normalize(car)})
        return car_json
    except CarCreationError:
        print(CarCreationError)
        return {'errors': ['The car was not created']}, 500


# DELETE a car
@car_routes.route('/cars/<int:car_id>', methods=['DELETE'])
@login_required
def car(car_id):
    delete_car = Car.query.get(car_id)
    if car:
        db.session.delete(car)
        db.session.commit()
        return {'message': 'Car was successfully deleted'}
    else:
        return {'errors': [f'Car Id: {car_id} was not found']}, 404
