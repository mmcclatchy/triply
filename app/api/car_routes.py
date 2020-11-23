from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Car, User, db

car_routes = Blueprint('cars', __name__)


@car_routes.route('/<int:user_id>/cars', methods=['GET'])
@login_required
def get_cars(user_id):
    cars = Car.query.filter(Car.user_id == user_id).all()
    return {'cars': cars}


@car_routes.route('/<int:user_id/cars/<int:car_id>', methods=['GET'])
@login_required
def get_car(user_id, car_id):
    


@car_routes.route('/<int:user_id>/cars', methods=['POST'])


@car_routes.route('/<int:user_id>/cars/<int:car_id>', methods=['DELETE'])
@login_required
def car(car_id):
    delete_car = Car.query.filter(Car.id == car_id).first()
    if car:
        db.session.delete(car)
        db.session.commit()
        return {'message': 'Car was successfully deleted'}
    else:
        return {'errors': f'Car Id: {car_id} was not found'}
