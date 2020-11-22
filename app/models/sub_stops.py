from .db import db


class SubStop(db.Model):
    __tablename__ = 'sub_stops'

    id = db.Column(db.Integer, foreign_key=True)
    type = db.Column(db.String(20), nullable=False)
    coordinates = db.Column(db.String(255), nullable=False)
    node_id = db.Column(db.Integer, nullable=False)
    place_id = db.Column(db.String(255), nullable=False)