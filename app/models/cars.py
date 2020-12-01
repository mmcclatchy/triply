from .db import db


class Car(db.Model):
    __tablename__ = "cars"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    api_id = db.Column(db.Integer, nullable=False)
    make = db.Column(db.String(100), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    miles_to_refuel = db.Column(db.Integer, nullable=False)
    mpg = db.Column(db.Float, nullable=False)

    trips = db.relationship('Trip',
                            backref=db.backref('car', lazy='joined'),
                            lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'api_id': self.api_id,
            'make': self.make,
            'model': self.model,
            'year': self.year,
            'miles_to_refuel': self.miles_to_refuel,
            'mpg': self.mpg
        }
