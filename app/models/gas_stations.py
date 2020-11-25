from .db import db


class GasStation(db.Model):
    __tablename__ = 'gas_stations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    place_id = db.Column(db.String(255), nullable=False)

    stops = db.relationship('Stop', backref='gas_station', lazy='joined')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'place_id': self.place_id,
            'stops': [stop.id for stop in self.stops]
        }
