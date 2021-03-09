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
      license_nm = db.Column(db.Text, nullable=False)
      license_get_date = db.Column(db.Date, nullable=False)
      license_issuing_org = db.Column(db.Text, nullable=True)
      user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)


def init_db():
      db.init_app(current_app)
      db.drop_all()
      db.create_all()
      sample_user1 = User(
            username="sodam", email="a@gmail.com", password=generate_password_hash("1234", method="sha256")
      )
      sample_user2 = User(
            username="seonghyeok", email="b@gmail.com", password=generate_password_hash("1234", method="sha256")
      )

      sample_user3= User(
            username="jinho", email="c@gmail.com", password=generate_password_hash("1234", method="sha256")
      )
      sample_user4 = User(
            username="lana", email="d@gmail.com", password=generate_password_hash("1234", method="sha256")
      )
      sample_user5 = User(
            username="jiyoung", email="e@gmail.com", password=generate_password_hash("1234", method="sha256")
      )
      sample_user6 = User(
            username="sohee", email="f@gmail.com", password=generate_password_hash("1234", method="sha256")
      )
      db.session.add(sample_user1)
      db.session.add(sample_user2)
      db.session.add(sample_user3)
      db.session.add(sample_user4)
      db.session.add(sample_user5)
      db.session.add(sample_user6)

      db.session.commit()
      sample_edu1 = Edu(
            edu_sc_nm="서울대학교", edu_major="경제학과", edu_gd_ck=1, user_id=1
      )
      sample_edu2 = Edu(
            edu_sc_nm="고려대학교", edu_major="물리학과", edu_gd_ck=3, user_id=2
      )
      sample_edu3 = Edu(
            edu_sc_nm="연세대학교", edu_major="수학과", edu_gd_ck=2, user_id=3
      )
      db.session.add(sample_edu1)
      db.session.add(sample_edu2)
      db.session.add(sample_edu3)
      db.session.commit()
      sample_awards1 = Awards(
            awards_nm="awards_nm1", awards_desc="awards_desc1", user_id=1
      )
      sample_awards2 = Awards(
            awards_nm="awards_nm2", awards_desc="awards_desc2", user_id=2
      )
      sample_awards3 = Awards(
            awards_nm="awards_nm3", awards_desc="awards_desc3", user_id=2
      )
      db.session.add(sample_awards1)
      db.session.add(sample_awards2)
      db.session.add(sample_awards3)
      db.session.commit()
      sample_project1 = Project(
            project_nm="엘리스 CheckMate TodoList", project_desc="체크리스트를 작성하고 관리할 수 있는 서비스", project_st=((datetime.utcnow()+timedelta(hours=(-168)))), project_et=((datetime.utcnow()+timedelta(hours=(-100)))), user_id=1
      )
      sample_project2 = Project(
            project_nm="레이서 포트폴리오 서비스", project_desc="자기자신의 포트폴리오를 업로드하고 다른 사람의 포트폴리오를 검색하여 확인할 수 있는 서비스", project_st=((datetime.utcnow()+timedelta(hours=(-80)))), project_et=((datetime.utcnow())), user_id=1
      )
      db.session.add(sample_project1)
      db.session.add(sample_project2)
      db.session.commit()
      sample_license = License(
            license_nm="license_nm1", license_issuing_org="license_issuing_org1", license_get_date=db.func.now(), user_id=1
      )
      db.session.add(sample_license)
      db.session.commit()
