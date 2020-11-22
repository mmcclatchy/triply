from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .user_cuisines import user_cuisines


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    star_min = db.Column(db.Integer)
    star_max = db.Column(db.Integer)

    cars = db.relationship('Car', backref='user', lazy='joined')
    cuisines = db.relationship('Cuisine', secondary=user_cuisines,
                               lazy='joined',
                               backref=db.backref('user', lazy=True))

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "star_min": self.star_min,
            "star_max": self.star_max,
            "cars": self.cars,
            "cuisines": self.cuisines
        }
