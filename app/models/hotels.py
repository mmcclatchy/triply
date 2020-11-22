from .db import db


class Hotel(db.Model):
    __tablename__ = 'hotels'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    stars = db.Column(db.Float, nullable=False)
    place_id = db.Column(db.String(255), nullable=False)

    stops = db.relationship('Stop', backref='hotel', lazy='joined')
