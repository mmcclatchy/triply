from .db import db


class Trip(db.Model):
    __tablename__ = 'trips'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    car_id = db.Column(db.Integer, db.ForeignKey('cars.id'), nullable=False)
    daily_time_limit = db.Column(db.Integer, nullable=False)
    stop_time_limit = db.Column(db.Integer, nullable=False)
    toll = db.Column(db.Boolean, nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    start_location = db.Column(db.String(255), nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    end_location = db.Column(db.String(255), nullable=False)

    sub_stops = db.relationship('SubStop', backref='trip', lazy='joined')