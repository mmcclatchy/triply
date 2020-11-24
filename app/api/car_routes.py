from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Car, User, db
from app.utils import normalize

car_routes = Blueprint('cars', __name__, url_prefix='/api')


# GET all cars owned by the specific user
@car_routes.route('/users/<int:user_id>/cars', methods=['GET'])
@login_required
def get_cars(user_id):
    try:
        cars = Car.query.filter(Car.user_id == user_id).all()
        return {'cars': normalize(cars)}
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        return {'errors': ['An error occurred while retrieving the data']}, 500


# GET a specific car
@car_routes.route('/cars/<int:car_id>', methods=['GET'])
@login_required
def get_car(car_id):
    try:
        car = Car.query.filter(Car.query.get(car_id))
        car_json = jsonify({'cars': normalize(car)})
        return car_json
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        return {'errors': ['An error occurred while retrieving the data']}, 500


# POST a new car for a specific user
@car_routes.route('/users/<int:user_id>/cars', methods=['POST'])
@login_required
def post_car(user_id):
    data = request.data
    car = Car(
        user_id=user_id,
        api_id=data.apiId,
        make=data.make,
        model=data.model,
        year=data.year,
        mpg=data.mpg
        )
    try:
        db.session.add(car)
        db.session.commit()
        car_json = jsonify({'cars': normalize(car)})
        return car_json
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(error)
        db.session.rollback()
        return {'errors': ['An error occurred while creating data']}, 500


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
