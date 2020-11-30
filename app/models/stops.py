from .db import db
from .stop_cuisines import stop_cuisines


class Stop(db.Model):
    __tablename__ = 'stops'

    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    trip_stop_num = db.Column(db.Integer, nullable=False)
    coordinates = db.Column(db.String(255), nullable=False)
    time = db.Column(db.DateTime)
    gas_station_id = db.Column(db.Integer, db.ForeignKey('gas_stations.id'))
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'))
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'))
    star_min = db.Column(db.Integer)
    star_max = db.Column(db.Integer)

    cuisines = db.relationship("Cuisine", secondary=stop_cuisines,
                               lazy="joined",
                               backref=db.backref("stop", lazy=True))
    gas_station = db.relationship('GasStation',
                                  back_populates='stops',
                                  lazy='joined')
    restaurant = db.relationship('Restaurant',
                                 back_populates='stops',
                                 lazy='joined')
    hotel = db.relationship('Hotel', back_populates='stops', lazy='joined')
    trip = db.relationship('Trip', back_populates='stops', lazy='joined')

    def to_dict(self):
        return {
            'id': self.id,
            'trip_id': self.trip_id,
            'trip_stop_num': self.trip_stop_num,
            'coordinates': self.coordinates,
            'time': self.time,
            'gas_station': self.gas_station.to_dict(),
            'hotel': self.hotel.to_dict(),
            'restaurant': self.restaurant.to_dict(),
            'star_min': self.star_min,
            'star_max': self.star_max,
            'stop_cuisines': [cuisine.id for cuisine in self.cuisines]
        }

    def info(self):
        gas = self.gas_station
        hotel = self.hotel
        rest = self.restaurant
        sub_stops = []

        for sub_stop in [gas, hotel, rest]:
            if sub_stop.id:
                return {
                    'id': sub_stop.id,
                    'trip_id': self.trip_id,
                    'trip_stop_num': self.trip_stop_num,
                    'coordinates': sub_stop.coordinates,
                    'time': self.time,
                    'type:': f'{sub_stop.__class__.__name__}',
                    'details': {
                        'name': sub_stop.name,
                        'street_address': sub_stop.street_address,
                        'city': sub_stop.city,
                        'zip_code': sub_stop.zip_code,
                        'phone_num': sub_stop.phone_num,
                        'img_url': sub_stop.img_url
                    }
                }
        return sub_stops
