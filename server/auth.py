from flask import Flask, Blueprint
from flask_restful import reqparse, abort, Api, Resource
from flask import jsonify, request, session

import pymysql

bp = Blueprint('auth', __name__, url_prefix='/auth')
api = Api(bp)

# mysql 연결설정
db = pymysql.connect(
        user = 'elice',
        passwd = '1234',
        host = '127.0.0.1',
        port = 3306,
        db = 'my_project',
        charset = 'utf8'
    )
cursor = db.cursor()

parser = reqparse.RequestParser()
parser.add_argument('id')
parser.add_argument('password')
parser.add_argument('confirm')
parser.add_argument('username')


@bp.route('/signup', methods=('GET', 'POST'))
def signup():

    # POST 요청일 경우
    if request.method == 'POST':
        # 입력된 데이터를 가져온다
        args = parser.parse_args()
        id = args['id']
        password = args['password']
        confirm = args['confirm']
        username = args['username']

        # print : 사용자 정보 확인
        print('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        print('>>>>> id :',id)
        print('>>>>> password :',password)
        print('>>>>> confirm :',confirm)
        print('>>>>> username :',username)
        print('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')

        # error 초기화
        error = None

        # 아이디가 없다면?
        if not id:
            error = '아이디가 유효하지 않습니다.'
        # 비밀번호가 없다면?
        elif not password:
            error = '비밀번호가 유효하지 않습니다.'
        # 비밀번호가 없다면?
        elif not confirm:
            error = '비밀번호가 유효하지 않습니다.'
        # 사용자명이 없다면?
        elif not username:
            error = '사용자명이 유효하지 않습니다.'

        # 이미 등록된 계정인지 확인
        sql = 'SELECT * FROM user WHERE id = %s'
        cursor.execute(sql, (id,))
        result = cursor.fetchone()
        if result is not None:
            error = '{} 계정은 이미 등록된 계정입니다.'.format(id)

    
        # error 확인
        print('>>>>> error :',error)
        
        print(result)

    return args