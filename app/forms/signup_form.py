from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, EqualTo
from app.models import User


dr = DataRequired()
e = Email()
match = EqualTo('confirm', message='Passwords must match')


def user_exists(form, field):
    print("Checking if user exits", field.data)
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError("User is already registered.")


class SignUpForm(FlaskForm):
    username = StringField('username', validators=[dr])
    email = StringField('email', validators=[dr, user_exists])
    password = StringField('password', validators=[dr, match])
    confirm = StringField('confirm')
