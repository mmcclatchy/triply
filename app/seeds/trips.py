from werkzeug.security import generate_password_hash
from app.models import db, Trip

# Adds a demo user, you can add other users here if you want


def seed_trips():

    fishing = Trip(user_id=1, name='Fishing Trip', car_id=1, start_iso="2020-12-17T10:54:00-06:00", start_location="Nashville, TN", end_iso="2020-12-18T10:54:00-06:00", end_location="Austin, TX", directions="null")
    family = Trip(user_id=1, name='Family Trip', car_id=1, start_iso="2020-11-23T10:54:00-05:00", start_location="New York, NY", end_iso="2020-11-24T10:54:00-05:00", end_location="Chelsea, MI", directions="null")
    girls = Trip(user_id=1, name='Girls Trip', car_id=1, start_iso="2020-12-01T10:54:00-05:00", start_location="322 W 101st St, NY, NY", end_iso="2020-12-18T10:54:00-05:00", end_location="Charleston, SC", directions="null")
    camping = Trip(user_id=1, name='Camping Trip', car_id=1, start_iso="2020-09-17T10:54:00-05:00", start_location="New York, NY", end_iso="2020-09-17T15:54:00-08:00", end_location="Ontario, CA", directions="null")


    db.session.add(fishing)
    db.session.add(family)
    db.session.add(girls)
    db.session.add(camping)
    # db.session.add(5)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key


def undo_trips():
    db.session.execute('TRUNCATE trips RESTART IDENTITY CASCADE;')
    db.session.commit()
