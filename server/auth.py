from flask import Flask, Blueprint, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from werkzeug.security import generate_password_hash, check_password_hash
from app import getDB
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

bp = Blueprint('auth', __name__, url_prefix='/auth')
api = Api(bp)
db = getDB()
cursor = db.cursor()

auth_parser = reqparse.RequestParser()
auth_parser.add_argument('email')
auth_parser.add_argument('password')
auth_parser.add_argument('confirm')
auth_parser.add_argument('username')


@bp.route('/signup', methods=('GET', 'POST'))
def signup():

    # POST 요청일 경우
    if request.method == 'POST':

        # 입력된 데이터를 가져온다
        args = auth_parser.parse_args()
        email = args['email']
        password = args['password']
        confirm = args['confirm']
        username = args['username']

        # error 초기화
        error = None

        # 아이디가 없다면?
        if not email:
            error = '아이디가 유효하지 않습니다.'
        # 비밀번호가 없다면?
        elif not password:
            error = '비밀번호가 유효하지 않습니다.'
        # 비밀번호가 없다면?
        elif not confirm:
            error = '비밀번호가 유효하지 않습니다.'
        # 비밀번호가 일치하지 않다면?
        elif password != confirm:
            error = '비밀번호가 일치하지 않습니다.'
        # 사용자명이 없다면?
        elif not username:
            error = '사용자명이 유효하지 않습니다.'

        # 이미 등록된 계정인지 확인
        sql = 'SELECT email FROM user WHERE email = %s'
        cursor.execute(sql, (email,))
        result = cursor.fetchone()
        if result is not None:
            error = '{} 계정은 이미 등록된 계정입니다.'.format(email)

        # error가 없다면 회원가입 진행
        if error is None:
            sql = "INSERT INTO `user` (`email`, `password`, `username`) VALUES (%s, %s, %s)"
            cursor.execute(sql, (email, generate_password_hash(password), username))
            result = cursor.fetchone()
            db.commit()
            return jsonify(status = "success", result = {"email": email, "username": username})

    return jsonify(status = "fail", result = {"error": error})


@bp.route('/login', methods=('GET', 'POST'))
def login():
    
    # POST 요청을 받았다면?
    if request.method == 'POST':
        # 입력된 데이터를 가져온다
        args = auth_parser.parse_args()
        email = args['email']
        password = args['password']

        error = None
        
        sql = 'SELECT email, password, id FROM user WHERE email = %s'
        cursor.execute(sql, (email,))
        user = cursor.fetchone()
        
        # 입력한 유저의 정보가 없을 때
        if user is None:
            error = '등록되지 않은 계정입니다.'
        
        # 비밀번호가 틀렸을 때
        # user는 tuple 타입으로 데이터 반환, user[0]은 email user[1]은 password 
        if not (user == None or check_password_hash(user[1], password)):
            error = '비밀번호가 일치하지 않습니다.'

        # 정상적인 정보를 요청받았다면?
        if error is None:
            # access_token 생성
            access_token = create_access_token(identity=user[2])
            return jsonify(status = "success", result = {"access_token": access_token})
        
        else:
            return jsonify(status = "fail", result = {"error": error})


@bp.route('/logout')
def logout():
    return jsonify(status = "success", result = {"msg": "logout"})


@bp.route('/protected')
@jwt_required()
def protected():
    # 복호화
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user)
