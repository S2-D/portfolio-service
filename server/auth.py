from flask import Flask, Blueprint, g
from flask_restful import reqparse, abort, Api, Resource
from flask import jsonify, request, session
from werkzeug.security import generate_password_hash, check_password_hash
from app import login_required, getDB

bp = Blueprint('auth', __name__, url_prefix='/auth')
api = Api(bp)
db = getDB()
cursor = db.cursor()

parser = reqparse.RequestParser()
parser.add_argument('email')
parser.add_argument('password')
parser.add_argument('confirm')
parser.add_argument('username')


@bp.route('/signup', methods=('GET', 'POST'))
def signup():

    # POST 요청일 경우
    if request.method == 'POST':

        # 입력된 데이터를 가져온다
        args = parser.parse_args()
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
        args = parser.parse_args()
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
            error = 'password가 틀렸습니다.'

        # 정상적인 정보를 요청받았다면?
        if error is None:
            # 로그인을 위해 기존 session을 비웁니다.
            session.clear()
            # 지금 로그인한 유저의 정보로 session을 등록합니다.
            session['email'] = user[0]
            session['id'] = user[2]
            return jsonify(status = "success", result = {"email": email, "session": session['email'], "user_id":session['id']})

    return jsonify(status = "fail", result = {"error": error})


@bp.route('/logout')
def logout():
    session.clear()
    return jsonify(status = "success", result = {"msg": "logout"})


@bp.before_app_request
def load_logged_in_user():
    email = session.get('email')

    if email is None:
        g.user = None
    else:
        sql = 'SELECT id, email FROM user WHERE email = %s'
        cursor.execute(sql, (email,))
        g.user = cursor.fetchone()
        # g.user[0] = id, g.user[1] = email
