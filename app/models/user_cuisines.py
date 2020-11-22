from .db import db


user_cuisines = db.Table('user_cuisines',
                         db.Column('user_id',
                                   db.Integer,
                                   db.ForeignKey('user.id'),
                                   primary_key=True),
                         db.Column('cuisine_id',
                                   db.Integer,
                                   db.ForeignKey('cuisine.id'),
                                   primary_key=True))
