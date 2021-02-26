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
      create_dt = db.Column(db.Date, default=((datetime.utcnow()+timedelta(hours=9))), nullable=True)

class Edu(db.Model):
      id = db.Column(db.Integer, primary_key=True)
      edu_sc_nm = db.Column(db.Text, nullable=False)
      edu_major = db.Column(db.Text, nullable=False)
      edu_gd_ck = db.Column(db.Integer, nullable=True)
      # edu_gd_ck = db.Column(db.Integer, nullable=False)
      edu_ins_date = db.Column(db.Date, default=((datetime.utcnow()+timedelta(hours=9))), nullable=True)
      edu_udt_date = db.Column(db.Date, default=((datetime.utcnow()+timedelta(hours=9))) ,nullable=True)
      user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)

class Awards(db.Model):
      id = db.Column(db.Integer, primary_key=True)
      awards_nm = db.Column(db.Text, nullable=False)
      awards_desc = db.Column(db.Text, nullable=False)
      awards_ins_date = db.Column(db.Date, default=((datetime.utcnow()+timedelta(hours=9))), nullable=True)
      awards_udt_date = db.Column(db.Date, default=((datetime.utcnow()+timedelta(hours=9))), nullable=True)
      user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)

class Project(db.Model):
      id = db.Column(db.Integer, primary_key=True)
      project_nm = db.Column(db.Text, nullable=False)
      project_desc = db.Column(db.Text, nullable=False)
      project_st = db.Column(db.Date, nullable=True)
      project_et = db.Column(db.Date, nullable=True)
      user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)

class License(db.Model):
      id = db.Column(db.Integer, primary_key=True)
      license_id = db.Column(db.Text, nullable=False)
      license_get_date = db.Column(db.Text, nullable=False)
      license_issuing_org = db.Column(db.Date, nullable=True)
      user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)


def init_db():
      db.init_app(current_app)
      db.drop_all()
      db.create_all()
      sample_user = User(
            username="sodam", email="a@gmail.com", password=generate_password_hash("1234", method="sha256")
      )
      db.session.add(sample_user)
      db.session.commit()
      sample_edu = Edu(
            edu_sc_nm="edu_sc_nm1", edu_major="edu_major1", edu_gd_ck=1, user_id=1
      )
      db.session.add(sample_edu)
      db.session.commit()
      sample_awards = Awards(
            awards_nm="awards_nm1", awards_desc="awards_desc1", user_id=1
      )
      db.session.add(sample_awards)
      db.session.commit()
      sample_project = Project(
            project_nm="project_nm1", project_desc="project_desc1", user_id=1
      )
      db.session.add(sample_project)
      db.session.commit()
      sample_license = License(
            license_id="license_id1", license_get_date="license_get_date1", user_id=1
      )
      db.session.add(sample_license)
      db.session.commit()
