from .db import db


stop_cuisines = db.Table('stop_cuisines',
                         db.Column('stop_id',
                                   db.Integer,
                                   db.ForeignKey('stops.id'),
                                   primary_key=True),
                         db.Column('cuisine_id',
                                   db.Integer,
                                   db.ForeignKey('cuisines.id'),
                                   primary_key=True))
