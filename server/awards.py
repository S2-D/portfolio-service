from flask import Flask, Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from config import DB_CONNECT
from app import getDB
from flask_jwt_extended import jwt_required

bp = Blueprint('awards', __name__, url_prefix='/awards')
api = Api(bp)
db = getDB()
cursor = db.cursor()

# for Awards api
awards_parser = reqparse.RequestParser()
awards_parser.add_argument('id')
awards_parser.add_argument('user_id')
awards_parser.add_argument('awards_nm')
awards_parser.add_argument('awards_desc')

class Awards(Resource):

    @jwt_required()
    def post(self):
        args = awards_parser.parse_args()
        sql = "INSERT INTO `awards` (`awards_nm`,`awards_desc`,`user_id`) VALUES (%s, %s, %s)"
        cursor.execute(sql, (args['awards_nm'], args['awards_desc'], args['user_id'] ))
        db.commit()
        return jsonify(status = "success", result = {"awards_nm": args["awards_nm"]})
    
    @jwt_required()
    def get(self):
        result = []
        args = awards_parser.parse_args()
        sql = "SELECT id, user_id, awards_nm, awards_desc, awards_ins_date, awards_udt_date FROM `awards` WHERE `user_id` = %s"
        cursor.execute(sql, (args['user_id'] ))
        awards = cursor.fetchall()
        for award in awards:
            result.append(
                {'id': award[0], 'user_id': award[1], 'awards_nm': award[2],'awards_desc': award[3], 'awards_ins_date': award[4], 'awards_udt_date': award[5]}
            )
        return jsonify(status = "success", result = result)

    @jwt_required()
    def put(self):
        args = awards_parser.parse_args()
        sql = "UPDATE `awards` SET awards_nm = %s, awards_desc= %s  WHERE `id` = %s"
        cursor.execute(sql, (args['awards_nm'], args['awards_desc'], args['id']))
        db.commit()
        return jsonify(status = "success", result ={"id": args['id'], "awards_nm": args["awards_nm"], "awards_desc": args["awards_desc"] })
    
    @jwt_required()
    def delete(self):
        args = awards_parser.parse_args()
        sql = "DELETE FROM `awards` WHERE `id` = %s"
        cursor.execute(sql, (args["id"], ))
        db.commit()
        return jsonify(status = "success", result = {"id": args["id"]})



api.add_resource(Awards, '/')
