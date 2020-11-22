from .db import db


user_cuisines = db.Table('user_cuisines',
                         db.Column('user_id',
                                   db.Integer,
                                   db.ForeignKey('users.id'),
                                   primary_key=True),
                         db.Column('cuisine_id',
                                   db.Integer,
                                   db.ForeignKey('cuisines.id'),
                                   primary_key=True))
