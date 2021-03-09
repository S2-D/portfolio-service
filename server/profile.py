from flask import Flask, Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from config import DB_CONNECT
from app import getDB
from flask_jwt_extended import jwt_required


bp = Blueprint('profile', __name__, url_prefix='/profile')
api = Api(bp)
db = getDB()
cursor = db.cursor()

profile_parser = reqparse.RequestParser()
profile_parser.add_argument('id')


class Profile(Resource):

    @jwt_required()
    def get(self):
        result=[]
        args = profile_parser.parse_args()
        sql = "SELECT * FROM `user` WHERE `id` = %s"
        cursor.execute(sql, (args['id']))
        profiles = cursor.fetchall()
        
        for profile in profiles:
            result.append(
                {'id': profile[0], 'email': profile[1] , 'username': profile[3]}
            )
        return jsonify(status = "success", result = result)
    
api.add_resource(Profile, '/')
