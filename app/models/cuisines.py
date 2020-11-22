from .db import db
from .user import user_cuisines


class Cuisine(db.Model):
    __tablename__ = 'cuisines'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    # users = db.relationship('User',
    #                         secondary=user_cuisines,
    #                         lazy='joined',
    #                         back_populates='cuisines',
    #                         backref=db.backref('cuisine', lazy='joined'))
