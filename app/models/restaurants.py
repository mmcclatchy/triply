from .db import db


class Restaurant(db.Model):
    __tablename__ = 'restaurants'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    cuisine_id = db.Column(db.Integer,
                           db.ForeignKey('cuisine.id'), nullable=False)
    place_id = db.Column(db.String(255), nullable=False)

    stops = db.relationship('Stop', backref='restaurant', lazy='joined')
