from flask import Flask, Blueprint, g
from flask_restful import reqparse, abort, Api, Resource
from flask import jsonify, request, session
from config import DB_CONNECT
from app import login_required

import pymysql

bp = Blueprint('portfolio', __name__, url_prefix='/portfolio')
api = Api(bp)

# mysql 연결설정
db = pymysql.connect(
        user = DB_CONNECT['username'],
        passwd = DB_CONNECT['password'],
        host = DB_CONNECT['server'],
        port = 3306,
        db = DB_CONNECT['dbname'],
        charset = 'utf8'
    )
cursor = db.cursor()

parser = reqparse.RequestParser()
parser.add_argument('id')
# for Edu api
parser.add_argument('EDU_SC_NM')
parser.add_argument('EDU_MAJOR')
parser.add_argument('EDU_GD_CK')
# parser.add_argument('EDU_INS_DATE')
# parser.add_argument('EDU_UDT_DATE')
# `EDU_INS_DATE`, `EDU_UDT_DATE`
# for Awards api
parser.add_argument('AWARDS_NM')
parser.add_argument('AWARDS_DESC')
# for Project api
parser.add_argument('PROJECT_NM')
parser.add_argument('PROJECT_DESC')
parser.add_argument('PROJECT_ST')
parser.add_argument('PROJECT_ET')
# for License api
parser.add_argument('LICENSE_NM')
parser.add_argument('LICENSE_ISSUING_ORG')
parser.add_argument('LICENSE_GET_DATE')


class Edu(Resource):
    def post(self):
        args = parser.parse_args()
        sql = "INSERT INTO `edu` (`EDU_SC_NM`,`EDU_MAJOR`,`EDU_GD_CK`) VALUES (%s, %s, %s)"
        cursor.execute(sql, (args['EDU_SC_NM'], args['EDU_MAJOR'], args['EDU_GD_CK'] ))
        db.commit()
        return jsonify(status = "success", result = {"학교명": args["EDU_SC_NM"]})
    
    def get(self):
            sql = "SELECT * FROM `edu`"
            cursor.execute(sql)
            result = cursor.fetchall()
            return jsonify(status = "success", result = result)

    def put(self):
        args = parser.parse_args()
        sql = "UPDATE `edu` SET EDU_SC_NM = %s, EDU_MAJOR= %s, EDU_GD_CK=%s  WHERE `id` = %s"
        cursor.execute(sql, (args['EDU_SC_NM'], args['EDU_MAJOR'], args['EDU_GD_CK'], args['id']))
        db.commit()
        return jsonify(status = "success", result ={"id": args['id'], "학교명": args["EDU_SC_NM"], "전공": args["EDU_MAJOR"], "상태": args['EDU_GD_CK'] })
    
    def delete(self):
        args = parser.parse_args()
        sql = "DELETE FROM `edu` WHERE `id` = %s"
        cursor.execute(sql, (args["id"], ))
        db.commit()
        
        return jsonify(status = "success", result = {"id": args["id"]})


class Awards(Resource):
    def post(self):
        args = parser.parse_args()
        sql = "INSERT INTO `awards` (`AWARDS_NM`,`AWARDS_DESC`) VALUES (%s, %s)"
        cursor.execute(sql, (args['AWARDS_NM'], args['AWARDS_DESC'] ))
        db.commit()
        return jsonify(status = "success", result = {"수상": args["AWARDS_NM"]})
    
    def get(self):
            sql = "SELECT * FROM `awards`"
            cursor.execute(sql)
            result = cursor.fetchall()
            return jsonify(status = "success", result = result)

    def put(self):
        args = parser.parse_args()
        sql = "UPDATE `awards` SET AWARDS_NM = %s, AWARDS_DESC= %s  WHERE `id` = %s"
        cursor.execute(sql, (args['AWARDS_NM'], args['AWARDS_DESC'], args['id']))
        db.commit()
        return jsonify(status = "success", result ={"id": args['id'], "수상": args["AWARDS_NM"], "내역": args["AWARDS_DESC"] })
    
    def delete(self):
        args = parser.parse_args()
        sql = "DELETE FROM `awards` WHERE `id` = %s"
        cursor.execute(sql, (args["id"], ))
        db.commit()
        
        return jsonify(status = "success", result = {"id": args["id"]})


api.add_resource(Edu, '/edu')
api.add_resource(Awards, '/awards')
