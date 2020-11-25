from .db import db
from .stop_cuisines import stop_cuisines


class Stop(db.Model):
    __tablename__ = 'stops'

    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    trip_stop_num = db.Column(db.Integer, nullable=False)
    coordinates = db.Column(db.String(255), nullable=False)
    gas_station_id = db.Column(db.Integer, db.ForeignKey('gas_stations.id'))
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'))
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'))
    star_min = db.Column(db.Integer)
    star_max = db.Column(db.Integer)

    cuisines = db.relationship("Cuisine", secondary=stop_cuisines,
                               lazy="joined",
                               backref=db.backref("stop", lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'trip_id': self.trip_id,
            'trip_stop_num': self.trip_stop_num,
            'coordinates': self.coordinates,
            'gas_station_id': self.gas_station_id,
            'hotel_id': self.hotel_id,
            'restaurant_id': self.restaurant_id,
            'star_min': self.star_min,
            'star_max': self.star_max,
            'cuisines': [cuisine.id for cuisine in self.cuisines]
        }