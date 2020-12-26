from .db import db
from ..utils import coords_from_str


class GasStation(db.Model):
    __tablename__ = 'gas_stations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    coordinates = db.Column(db.String(50))
    phone_num = db.Column(db.String(15))
    street_address = db.Column(db.String(100))
    city = db.Column(db.String(50))
    state = db.Column(db.String(2))
    img_url = db.Column(db.Text)
    zip_code = db.Column(db.Integer)
    place_id = db.Column(db.String(255), nullable=False)

    stops = db.relationship('Stop', back_populates='gas_station', lazy='joined')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'coordinates': coords_from_str(self.coordinates),
            'phone_num': self.phone_num,
            'street_address': self.street_address,
            'city': self.city,
            'state': self.state,
            'zip_code': self.zip_code,
            'img_url': self.img_url,
            'place_id': self.place_id,
            # 'stops': [stop.id for stop in self.stops]
        }
