from werkzeug.security import generate_password_hash
from app.models import db, Trip

# Adds a demo user, you can add other users here if you want


def seed_trips():

    fishing = Trip(user_id=1, name='Fishing Trip', car_id=1, daily_time_limit=3, stop_time_limit=3, toll=False, start_time="2020-12-17 10:54:00", start_location="Nashville, TN", end_time="2020-12-18 10:54:00", end_location="Austin, TX", directions="null")
    family = Trip(user_id=1, name='Family Trip', car_id=1, daily_time_limit=3, stop_time_limit=3, toll=False, start_time="2020-11-23 10:54:00", start_location="New York, NY", end_time="2020-11-24 10:54:00", end_location="Chelsea, MI", directions="null")
    girls = Trip(user_id=1, name='Girls Trip', car_id=1, daily_time_limit=3, stop_time_limit=3, toll=False, start_time="2020-12-01 10:54:00", start_location="322 W 101st St, NY, NY", end_time="2020-12-18 10:54:00", end_location="Charleston, SC", directions="null")
    camping = Trip(user_id=1, name='Camping Trip', car_id=1, daily_time_limit=3, stop_time_limit=3, toll=False, start_time="2020-09-17 10:54:00", start_location="New York, NY", end_time="2020-09-17 15:54:00", end_location="Ontario, CA", directions="null")


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
