from flask import current_app
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash
from flask_login import UserMixin
from config import DB_CONNECT
from datetime import datetime,timedelta

current_app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql://{DB_CONNECT['username']}:{DB_CONNECT['password']}@{DB_CONNECT['server']}:3306/{DB_CONNECT['dbname']}?charset=utf8"
current_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(current_app)


class User(UserMixin, db.Model):
      id = db.Column(db.Integer, primary_key=True)
      email = db.Column(db.String(50), unique=True, nullable=False)
      password = db.Column(db.Text, nullable=False)
      username = db.Column(db.String(15), nullable=False)


class Edu(db.Model):
      id = db.Column(db.Integer, primary_key=True)
      EDU_SC_NM = db.Column(db.Text, nullable=False)
      EDU_MAJOR = db.Column(db.Text, nullable=False)
      EDU_GD_CK = db.Column(db.Integer, nullable=False)
    #   EDU_INS_DATE = db.Column(db.Date, default=((datetime.utcnow()+timedelta(hours=9))), nullable=True)
    #   EDU_UDT_DATE = db.Column(db.Date, default=((datetime.utcnow()+timedelta(hours=9))) ,nullable=True)
    #   user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)

class Awards(db.Model):
      id = db.Column(db.Integer, primary_key=True)
      AWARDS_NM = db.Column(db.Text, nullable=False)
      AWARDS_DESC = db.Column(db.Text, nullable=False)
    #   AWARDS_INS_DATE = db.Column(db.Date, default=((datetime.utcnow()+timedelta(hours=9))), nullable=True)
    #   AWARDS_UDT_DATE = db.Column(db.Date, default=((datetime.utcnow()+timedelta(hours=9))), nullable=True)
    #   user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)

class Project(db.Model):
      id = db.Column(db.Integer, primary_key=True)
      PROJECT_NM = db.Column(db.Text, nullable=False)
      PROJECT_DESC = db.Column(db.Text, nullable=False)
      PROJECT_ST = db.Column(db.Date, nullable=True)
      PROJECT_ET = db.Column(db.Date, nullable=True)
    #   user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)

class License(db.Model):
      id = db.Column(db.Integer, primary_key=True)
      LICENSE_NM = db.Column(db.Text, nullable=False)
      LICENSE_ISSUING_ORG = db.Column(db.Text, nullable=False)
      LICENSE_GET_DATE = db.Column(db.Date, nullable=True)
    #   user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)


def init_db():
      db.init_app(current_app)
      db.drop_all()
      db.create_all()
      sample_user = User(
            username="sodam", email="a@gmail.com", password=generate_password_hash("1234", method="sha256")
      )
      db.session.add(sample_user)
      db.session.commit()
