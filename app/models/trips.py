from .db import db
from ..utils import coords_from_str


class Trip(db.Model):
    __tablename__ = 'trips'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    car_id = db.Column(db.Integer, db.ForeignKey('cars.id'))
    directions = db.Column(db.Text)
    start_location = db.Column(db.String(255))
    end_location = db.Column(db.String(255))
    start_iso = db.Column(db.String(35))

    stops = db.relationship('Stop', back_populates='trip', lazy='joined')
    car = db.relationship('Car', back_populates='trips', lazy='joined')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'car_id': self.car_id,
            'start_location': self.start_location,
            'end_location': self.end_location,
            'start_iso': self.start_iso,
            'stops': [stop.id for stop in self.stops]
        }

    def directions_to_dict(self):
        if self.directions:
            return {'id': self.id, 'directions': self.directions}
        else:
            return {}

    def get_timeline(self):
        return [
            {
                'id': self.id,
                'trip_id': self.id,
                'trip_stop_num': 0,
                'coordinates': coords_from_str(self.start_location),
                'time': self.start_time,
                'type:': 'Origin'
            },
            [stop.info() for stop in self.stops],
            {
                'id': self.id,
                'trip_id': self.id,
                'trip_stop_num': len(self.stops) + 1,
                'coordinates': coords_from_str(self.start_location),
                'time': self.end_time,
                'type:': 'Destination'
            }
        ]

    def get_cuisines(self):
        return [stop.restaurant.get_cuisines() for stop in self.stops][0]

    def next_cuisine_option(self, cuisines_from_front_end):
        if len(cuisines_from_front_end) == 1:
            return cuisines_from_front_end[0]
        db_cuisines = self.get_cuisines()
        db_cuisines = set(db_cuisines)
        fe_cuisines = set(cuisines_from_front_end)
        cuisine = fe_cuisines.difference(db_cuisines).pop()
        if cuisine:
            return cuisine
        else:
            return None

