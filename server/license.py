from flask import Flask, Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from config import DB_CONNECT
from app import getDB
from flask_jwt_extended import jwt_required

bp = Blueprint('license', __name__, url_prefix='/license')
api = Api(bp)
db = getDB()
cursor = db.cursor()

# for License api
license_parser = reqparse.RequestParser()
license_parser.add_argument('id')
license_parser.add_argument('user_id')
license_parser.add_argument('license_nm')
license_parser.add_argument('license_get_date')
license_parser.add_argument('license_issuing_org')

class License(Resource):
    @jwt_required()
    def post(self):
        args = license_parser.parse_args()
        sql = "INSERT INTO `license` (`license_nm`,`license_get_date`,`license_issuing_org`, `user_id`) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (args['license_nm'], args['license_get_date'], args['license_issuing_org'], args['user_id'] ))
        db.commit()
        return jsonify(status = "success", result = {"license_nm": args["license_nm"]})
    
    @jwt_required()
    def get(self):
        result = []
        args = license_parser.parse_args()
        sql = "SELECT id, user_id, license_nm, license_get_date, license_issuing_org FROM `license` WHERE `user_id` = %s"
        cursor.execute(sql, (args['user_id'] ))
        licenses = cursor.fetchall()
        for license in licenses:
            result.append(
                {'id': license[0], 'user_id': license[1], 'license_nm': license[2], 'license_get_date': license[3], 'license_issuing_org' : license[4]}
            )
        return jsonify(status = "success", result = result)

    @jwt_required()
    def put(self):
        args = license_parser.parse_args()
        sql = "UPDATE `license` SET license_nm = %s, license_get_date= %s, license_issuing_org=%s WHERE `id` = %s"
        cursor.execute(sql, (args['license_nm'], args['license_get_date'], args['license_issuing_org'], args['id']))
        db.commit()
        return jsonify(status = "success", result ={"id": args['id'], "license_nm": args["license_nm"], "license_get_date": args["license_get_date"] })

    @jwt_required()    
    def delete(self):
        args = license_parser.parse_args()
        sql = "DELETE FROM `license` WHERE `id` = %s"
        cursor.execute(sql, (args["id"], ))
        db.commit()
        return jsonify(status = "success", result = {"id": args["id"]})


api.add_resource(License, '/')
