from flask import Flask, g, jsonify, Response
from flask_cors import CORS
from config import DB_CONNECT, SECRET_KEY
from flask_jwt_extended import JWTManager

import functools
import pymysql
 



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
    app.config["JWT_SECRET_KEY"] = SECRET_KEY

    jwt = JWTManager(app)

    CORS(app, resources={r'*': {'origins': '*'}}, supports_credentials=True)

    import auth

    app.register_blueprint(auth.bp)

    import edu

    app.register_blueprint(edu.bp)

    import network

    app.register_blueprint(network.bp)

    with app.app_context():
        import db

        db.init_db()

    return app
