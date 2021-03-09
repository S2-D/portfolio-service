from flask import Flask, Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from config import DB_CONNECT
from app import getDB
from flask_jwt_extended import jwt_required

bp = Blueprint('project', __name__, url_prefix='/project')
api = Api(bp)
db = getDB()
cursor = db.cursor()

# for Project api
project_parser = reqparse.RequestParser()
project_parser.add_argument('id')
project_parser.add_argument('user_id')
project_parser.add_argument('project_nm')
project_parser.add_argument('project_desc')
project_parser.add_argument('project_st')
project_parser.add_argument('project_et')


class Project(Resource):
    @jwt_required()
    def post(self):
        args = project_parser.parse_args()
        sql = "INSERT INTO `project` (`project_nm`,`project_desc`,`project_st`, `project_et`, `user_id`) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(sql, (args['project_nm'], args['project_desc'], args['project_st'], args['project_et'], args['user_id'] ))
        db.commit()
        return jsonify(status = "success", result = {"project_nm": args["project_nm"]})
    
    @jwt_required()
    def get(self):
        result = []
        args = project_parser.parse_args()
        sql = "SELECT id, user_id, project_nm, project_desc, project_st, project_et FROM `project` WHERE `user_id` = %s"
        cursor.execute(sql, (args['user_id']))
        projects = cursor.fetchall()
        for project in projects:
            result.append(
                {'id': project[0], 'user_id': project[1], 'project_nm': project[2], 'project_desc': project[3], 'project_st' : project[4], 'project_et' : project[5]}
            )
        return jsonify(status = "success", result = result)

    @jwt_required()
    def put(self):
        args = project_parser.parse_args()
        sql = "UPDATE `project` SET project_nm = %s, project_desc= %s, project_st= %s, project_et= %s  WHERE `id` = %s"
        cursor.execute(sql, (args['project_nm'], args['project_desc'], args['project_st'], args['project_et'], args['id']))
        db.commit()
        return jsonify(status = "success", result ={"id": args['id'], "project_nm": args["project_nm"], "project_desc": args["project_desc"] })
    
    @jwt_required()
    def delete(self):
        args = project_parser.parse_args()
        sql = "DELETE FROM `project` WHERE `id` = %s"
        cursor.execute(sql, (args["id"], ))
        db.commit()
        return jsonify(status = "success", result = {"id": args["id"]})


api.add_resource(Project, '/')

