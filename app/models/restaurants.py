from .db import db
from .restaurant_cuisines import restaurant_cuisines


class Restaurant(db.Model):
    __tablename__ = "restaurants"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone_num = db.Column(db.String(15))
    street_address = db.Column(db.String(100))
    city = db.Column(db.String(50))
    state = db.Column(db.String(2))
    zip_code = db.Column(db.String(10))
    img_url = db.Column(db.String(255))
    place_id = db.Column(db.String(255), nullable=False)

    stops = db.relationship("Stop", backref="restaurant", lazy="joined")
    cuisines = db.relationship("Cuisine", secondary=restaurant_cuisines,
                               lazy="joined",
                               backref=db.backref("restaurant", lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone_num': self.phone_num,
            'street_address': self.street_address,
            'city': self.city,
            'state': self.state,
            'zip_code': self.zip_code,
            'img_url': self.img_url,
            'place_id': self.place_id,
            'stops': [stop.id for stop in self.stops],
            'cuisines': [cuisine.id for cuisine in self.cuisines]
        }
