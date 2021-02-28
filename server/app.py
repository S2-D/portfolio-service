from flask import Flask, g, jsonify, Response
from flask_cors import CORS
from config import DB_CONNECT, SECRET_KEY

import functools
import pymysql

# 데코레이터 함수
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return jsonify(status="fail", result={"error": "로그인 후 이용해주세요."})
        return view(**kwargs)

    return wrapped_view


# pymysql 연결설정
def getDB():
    db = pymysql.connect(
        user=DB_CONNECT["username"],
        passwd=DB_CONNECT["password"],
        host=DB_CONNECT["server"],
        port=3306,
        db=DB_CONNECT["dbname"],
        charset="utf8",
    )
    return db


# 애플리케이션 팩토리
def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = SECRET_KEY

    CORS(app, resources={r'*': {'origins': '*'}}, supports_credentials=True)

    import auth

    app.register_blueprint(auth.bp)

    from portfolio import portfolio

    app.register_blueprint(portfolio.bp)

    import network

    app.register_blueprint(network.bp)

    with app.app_context():
        import db

        db.init_db()

    return app
