from flask import Flask, Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from config import DB_CONNECT
from app import getDB
from flask_jwt_extended import jwt_required

bp = Blueprint('edu', __name__, url_prefix='/edu')
api = Api(bp)
db = getDB()
cursor = db.cursor()

# for Edu api
edu_parser = reqparse.RequestParser()
edu_parser.add_argument('id')
edu_parser.add_argument('user_id')
edu_parser.add_argument('edu_sc_nm')
edu_parser.add_argument('edu_major')
edu_parser.add_argument('edu_gd_ck')

class Edu(Resource):

    @jwt_required()
    def post(self):
        args = edu_parser.parse_args()
        sql = "INSERT INTO `edu` (`edu_sc_nm`,`edu_major`,`edu_gd_ck`,`user_id`) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (args['edu_sc_nm'], args['edu_major'], args['edu_gd_ck'], args['user_id']))
        db.commit()
        return jsonify(status = "success", result = {"edu_sc_nm": args["edu_sc_nm"]})
    
    @jwt_required()
    def get(self):
        result = []
        args = edu_parser.parse_args()
        sql = "SELECT id, user_id,  edu_sc_nm, edu_major, edu_gd_ck FROM `edu` WHERE `user_id` = %s"
        cursor.execute(sql, (args['user_id']))
        edus = cursor.fetchall()
        for edu in edus:
            result.append(
                {'id': edu[0], 'user_id': edu[1], 'edu_sc_nm': edu[2], 'edu_major': edu[3] , 'edu_gd_ck': edu[4]}
            )
        return jsonify(status = "success", result = result)

    @jwt_required()
    def put(self):
        args = edu_parser.parse_args()
        sql = "UPDATE `edu` SET edu_sc_nm = %s, edu_major= %s, edu_gd_ck=%s  WHERE `id` = %s"
        cursor.execute(sql, (args['edu_sc_nm'], args['edu_major'], args['edu_gd_ck'], args['id']))
        db.commit()
        return jsonify(status = "success", result ={"id": args['id'], "edu_sc_nm": args["edu_sc_nm"], "edu_major": args["edu_major"], "edu_gd_ck": args['edu_gd_ck'] })
    
    @jwt_required()
    def delete(self):
        args = edu_parser.parse_args()
        sql = "DELETE FROM `edu` WHERE `id` = %s"
        cursor.execute(sql, (args["id"], ))
        db.commit()
        return jsonify(status = "success", result = {"id": args["id"]})


api.add_resource(Edu, '/')
