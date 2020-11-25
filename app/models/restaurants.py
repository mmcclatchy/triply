from .db import db
from .restaurant_cuisines import restaurant_cuisines


class Restaurant(db.Model):
    __tablename__ = "restaurants"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    place_id = db.Column(db.String(255), nullable=False)

    stops = db.relationship("Stop", backref="restaurant", lazy="joined")
    cuisines = db.relationship("Cuisine", secondary=restaurant_cuisines,
                               lazy="joined",
                               backref=db.backref("restaurant", lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'place_id': self.place_id,
            'stops': [stop.id for stop in self.stops],
            'cuisines': [cuisine.id for cuisine in self.cuisines]
        }
