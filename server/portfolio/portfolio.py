from flask import Flask, Blueprint, g, Response
from flask_restful import reqparse, abort, Api, Resource
from flask import jsonify, request, session
from werkzeug.security import generate_password_hash, check_password_hash
from app import login_required, getDB

bp = Blueprint('portfolio', __name__, url_prefix='/portfolio')
api = Api(bp)
db = getDB()
cursor = db.cursor()

resp = Response()
resp.headers['Access-Control-Allow-Origin'] = '*'

portfolio_parser = reqparse.RequestParser()
portfolio_parser.add_argument('id')

@bp.route('/', methods=('GET', 'POST'))
@login_required
def index():
    args = portfolio_parser.parse_args()

    # POST 요청일 경우
    if request.method == 'GET':
        sql = "SELECT * FROM `edu` WHERE `id` = %s"
        cursor.execute(sql, args['id'])
        result = cursor.fetchall()
        #output = {"id": user[2], "session": session['email']}
        resp.set_data(json.dumps(result))
        return resp
    elif request.method == 'POST':

        return jsonify(status = "success", result = result)
    
    