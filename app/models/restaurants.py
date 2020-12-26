from .db import db
from .restaurant_cuisines import restaurant_cuisines
from ..utils import coords_from_str


class Restaurant(db.Model):
    __tablename__ = "restaurants"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    coordinates = db.Column(db.String(50))
    phone_num = db.Column(db.String(15))
    street_address = db.Column(db.String(100))
    city = db.Column(db.String(50))
    state = db.Column(db.String(2))
    img_url = db.Column(db.Text)
    zip_code = db.Column(db.String(10))
    place_id = db.Column(db.String(255), nullable=False)

    cuisines = db.relationship("Cuisine", secondary=restaurant_cuisines,
                               lazy="joined",
                               backref=db.backref("restaurant", lazy=True))
    stops = db.relationship('Stop', back_populates='restaurant', lazy='joined')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone_num': self.phone_num,
            'coordinates': coords_from_str(self.coordinates),
            'street_address': self.street_address,
            'city': self.city,
            'state': self.state,
            'zip_code': self.zip_code,
            'img_url': self.img_url,
            'place_id': self.place_id,
            # 'stops': [stop.id for stop in self.stops],
            'restaurant_cuisines':
                [cuisine.to_dict() for cuisine in self.cuisines]
        }

    def get_cuisines(self):
        return [cuisine.to_dict()['name'] for cuisine in self.cuisines]
