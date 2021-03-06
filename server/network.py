from flask import Flask, Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from config import DB_CONNECT
from app import getDB
<<<<<<< HEAD
=======
from flask_jwt_extended import jwt_required

>>>>>>> final

bp = Blueprint('network', __name__, url_prefix='/network')
api = Api(bp)
db = getDB()
cursor = db.cursor()

network_parser = reqparse.RequestParser()
network_parser.add_argument('username')


class Network(Resource):

    @jwt_required()
    def get(self):
        result=[]
        args = network_parser.parse_args()

        username = ''

        if args['username'] == '':
            sql = "SELECT * FROM `user`"
            cursor.execute(sql)

        else:
            username = '%' + args['username'] + '%'
            sql = "SELECT * FROM `user` WHERE username LIKE %s"
            cursor.execute(sql, (username ,))
        
        networks = cursor.fetchall()
        
        for network in networks:
            result.append(
                {'id': network[0], 'email': network[1] , 'username': network[3]}
            )
        return jsonify(status = "success", result = result)
    
api.add_resource(Network, '/')
