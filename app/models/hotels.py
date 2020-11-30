from .db import db
from ..utils import coords_from_str


class Hotel(db.Model):
    __tablename__ = 'hotels'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    coordinates = db.Column(db.String(50))
    phone_num = db.Column(db.String(15))
    street_address = db.Column(db.String(100))
    city = db.Column(db.String(50))
    state = db.Column(db.String(2))
    zip_code = db.Column(db.String(10))
    img_url = db.Column(db.String(255))
    stars = db.Column(db.Float, nullable=False)
    place_id = db.Column(db.String(255), nullable=False)

    stops = db.relationship('Stop', back_populates='hotel', lazy='joined')

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
            'stars': self.stars,
            'place_id': self.place_id,
            # 'stops': [stop.id for stop in self.stops]
        }
