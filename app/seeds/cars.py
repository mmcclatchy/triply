from werkzeug.security import generate_password_hash
from app.models import db, Car

# Adds a demo user, you can add other users here if you want


def seed_cars():

    demo = Car(user_id=1, api_id=21374, make="Chevrolet", model="Equinox AWD", year=2005, miles_to_refuel=350, mpg=30)  # noqa
    mark = Car(user_id=2, api_id=29658, make="Honda", model="Accord", year=2010, miles_to_refuel=350, mpg=30)  # noqa
    ryan = Car(user_id=3, api_id=29823, make="BMW", model="128ci Convertible", year=2010, miles_to_refuel=350, mpg=30)  # noqa
    brandon = Car(user_id=4, api_id=38911, make="Volkswagen", model="Beetle", year=2018, miles_to_refuel=350, mpg=30)  # noqa
    alycia = Car(user_id=5, api_id=39506, make="Buick", model="Regal", year=2018, miles_to_refuel=350, mpg=30)  # noqa

    db.session.add(demo)
    db.session.add(mark)
    db.session.add(ryan)
    db.session.add(brandon)
    db.session.add(alycia)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and resets
# the auto incrementing primary key


def undo_cars():
    db.session.execute('TRUNCATE cars;')
    db.session.commit()
