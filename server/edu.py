from flask import Flask, Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from config import DB_CONNECT
from app import getDB
from flask_jwt_extended import jwt_required

bp = Blueprint('edu', __name__, url_prefix='/edu')
api = Api(bp)
db = getDB()
cursor = db.cursor()

# for Edu apia
edu_parser = reqparse.RequestParser()
edu_parser.add_argument('user_id')
edu_parser.add_argument('edu_sc_nm')
edu_parser.add_argument('edu_major')
edu_parser.add_argument('edu_gd_ck')

# for Awards api
# awards_parser = reqparse.RequestParser()
# awards_parser.add_argument('id', required=True)
# awards_parser.add_argument('awards_nm', required=True)
# awards_parser.add_argument('awards_desc', required=True)

# # for Project api
# project_parser = reqparse.RequestParser()
# project_parser.add_argument('id', required=True)
# project_parser.add_argument('project_nm', required=True)
# project_parser.add_argument('project_desc', required=True)
# project_parser.add_argument('project_st', required=True)
# project_parser.add_argument('project_et', required=True)

# # for License api
# license_parser = reqparse.RequestParser()
# license_parser.add_argument('id', required=True)
# license_parser.add_argument('license_nm', required=True)
# license_parser.add_argument('license_get_date', required=True)
# license_parser.add_argument('license_issuing_org', required=True)


class Edu(Resource):
    
    def post(self):
        args = edu_parser.parse_args()
        sql = "INSERT INTO `edu` (`edu_sc_nm`,`edu_major`,`edu_gd_ck`,`user_id`) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (args['edu_sc_nm'], args['edu_major'], args['edu_gd_ck'], args['user_id']))
        db.commit()
        return jsonify(status = "success", result = {"edu_sc_nm": args["edu_sc_nm"]})
    
    def get(self):
        result = []
        args = edu_parser.parse_args()
        sql = "SELECT edu_sc_nm, edu_major, edu_gd_ck FROM `edu` WHERE user_id = %s"
        cursor.execute(sql, (args['user_id']))
        edus = cursor.fetchall()
        for edu in edus:
            result.append(
                {'edu_sc_nm': edu[0], 'edu_major': edu[1] , 'edu_gd_ck': edu[2]}
            )

        return jsonify(status = "success", result = result)

    def put(self):
        args = edu_parser.parse_args()
        sql = "UPDATE `edu` SET edu_sc_nm = %s, edu_major= %s, edu_gd_ck=%s  WHERE `id` = %s"
        cursor.execute(sql, (args['edu_sc_nm'], args['edu_major'], args['edu_gd_ck'], args['id']))
        db.commit()
        return jsonify(status = "success", result ={"id": args['id'], "edu_sc_nm": args["edu_sc_nm"], "edu_major": args["edu_major"], "edu_gd_ck": args['edu_gd_ck'] })
    
    def delete(self):
        args = edu_parser.parse_args()
        sql = "DELETE FROM `edu` WHERE `id` = %s"
        cursor.execute(sql, (args["id"], ))
        db.commit()
        return jsonify(status = "success", result = {"id": args["id"]})


# class Awards(Resource):
#     def post(self):
#         args = awards_parser.parse_args()
#         sql = "INSERT INTO `awards` (`awards_nm`,`awards_desc`,`user_id`) VALUES (%s, %s, %s)"
#         cursor.execute(sql, (args['awards_nm'], args['awards_desc'], g.user[0] ))
#         db.commit()
#         return jsonify(status = "success", result = {"awards_nm": args["awards_nm"]})
    
#     def get(self):
#         sql = "SELECT * FROM `awards` WHERE `user_id` = %s"
#         cursor.execute(sql, (g.user[0], ))
#         result = cursor.fetchall()
#         return jsonify(status = "success", result = result)

#     def put(self):
#         args = awards_parser.parse_args()
#         sql = "UPDATE `awards` SET awards_nm = %s, awards_desc= %s  WHERE `id` = %s"
#         cursor.execute(sql, (args['awards_nm'], args['awards_desc'], args['id']))
#         db.commit()
#         return jsonify(status = "success", result ={"id": args['id'], "awards_nm": args["awards_nm"], "awards_desc": args["awards_desc"] })
    
#     def delete(self):
#         args = awards_parser.parse_args()
#         sql = "DELETE FROM `awards` WHERE `id` = %s"
#         cursor.execute(sql, (args["id"], ))
#         db.commit()
#         return jsonify(status = "success", result = {"id": args["id"]})


# class Project(Resource):
#     def post(self):
#         args = project_parser.parse_args()
#         sql = "INSERT INTO `project` (`project_nm`,`project_desc`,`project_st`, `project_et`, `user_id`) VALUES (%s, %s, %s, %s, %s)"
#         cursor.execute(sql, (args['project_nm'], args['project_desc'], args['project_st'], args['project_et'], g.user[0] ))
#         db.commit()
#         return jsonify(status = "success", result = {"project_nm": args["project_nm"]})
    
#     def get(self):
#         sql = "SELECT * FROM `project` WHERE `user_id` = %s"
#         cursor.execute(sql, (g.user[0], ))
#         result = cursor.fetchall()
#         return jsonify(status = "success", result = result)

#     def put(self):
#         args = project_parser.parse_args()
#         sql = "UPDATE `project` SET project_nm = %s, project_desc= %s, project_st= %s, project_et= %s  WHERE `id` = %s"
#         cursor.execute(sql, (args['project_nm'], args['project_desc'], args['project_st'], args['project_et'], args['id']))
#         db.commit()
#         return jsonify(status = "success", result ={"id": args['id'], "project_nm": args["project_nm"], "project_desc": args["project_desc"] })
    
#     def delete(self):
#         args = project_parser.parse_args()
#         sql = "DELETE FROM `project` WHERE `id` = %s"
#         cursor.execute(sql, (args["id"], ))
#         db.commit()
#         return jsonify(status = "success", result = {"id": args["id"]})


# class License(Resource):
#     def post(self):
#         args = license_parser.parse_args()
#         sql = "INSERT INTO `license` (`license_nm`,`license_get_date`,`license_issuing_org`, `user_id`) VALUES (%s, %s, %s, %s)"
#         cursor.execute(sql, (args['license_nm'], args['license_get_date'], args['license_issuing_org'], g.user[0] ))
#         db.commit()
#         return jsonify(status = "success", result = {"license_nm": args["license_nm"]})
    
#     def get(self):
#         sql = "SELECT * FROM `license` WHERE `user_id` = %s"
#         cursor.execute(sql, (g.user[0], ))
#         result = cursor.fetchall()
#         return jsonify(status = "success", result = result)

#     def put(self):
#         args = license_parser.parse_args()
#         sql = "UPDATE `license` SET license_nm = %s, license_get_date= %s, license_issuing_org=%s WHERE `id` = %s"
#         cursor.execute(sql, (args['license_nm'], args['license_get_date'], args['license_issuing_org'], args['id']))
#         db.commit()
#         return jsonify(status = "success", result ={"id": args['id'], "license_nm": args["license_nm"], "license_get_date": args["license_get_date"] })
    
#     def delete(self):
#         args = license_parser.parse_args()
#         sql = "DELETE FROM `license` WHERE `id` = %s"
#         cursor.execute(sql, (args["id"], ))
#         db.commit()
#         return jsonify(status = "success", result = {"id": args["id"]})


api.add_resource(Edu, '/')
# api.add_resource(Awards, '/awards')
