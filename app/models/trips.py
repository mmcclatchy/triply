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

    stops = db.relationship('Stop', backref='trip', lazy='joined')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'car_id': self.car_id,
            'daily_time_limit': self.daily_time_limit,
            'stop_time_limit': self.stop_time_limit,
            'toll': self.toll,
            'start_time': self.start_time,
            'start_location': self.start_location,
            'end_time': self.end_time,
            'end_location': self.end_location,
            'stops': [stop.id for stop in self.stops]
        }
