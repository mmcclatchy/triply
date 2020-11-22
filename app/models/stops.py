from .db import db


class Stop(db.Model):
    __tablename__ = 'stops'

    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'), nullable=False)
    trip_stop_num = db.Column(db.Integer, nullable=False)
    coordinates = db.Column(db.String(255), nullable=False)
    gas_station_id = db.Column(db.Integer, db.ForeignKey('gas_station.id'))
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotel.id'))
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurant.id'))
