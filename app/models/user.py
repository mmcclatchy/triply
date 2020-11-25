from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from ..utils import normalize


class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    cars = db.relationship("Car", backref="user", lazy="joined")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def cars_to_dict(self):
        if not isinstance(self.cars, list):
            return self.cars.to_dict()
        return [car.to_dict() for car in self.cars]

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "cars": [car.id for car in self.cars]
        }
