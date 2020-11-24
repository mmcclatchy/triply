from werkzeug.security import generate_password_hash
from app.models import db, Car

# Adds a demo user, you can add other users here if you want


def seed_cars():

    demo = Car(user_id=1, car_id=19720, make="BMW", model="525I", year=2004, mpg=)
    mark = User(username='Mark', email="mark@aa.io", password='password')
    ryan = User(username='Ryan', email="ryan@aa.io", password='password')
    brandon = User(username='Brandon', email="brandon@aa.io", password='password')  # noqa
    alycia = User(username='Alycia', email="alycia@aa.io", password='password')

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
