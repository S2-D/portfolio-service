from flask import Flask, g, jsonify
from flask_cors import CORS
from config import SECRET_KEY
import functools

def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return jsonify(status = "fail", result = {"error": '로그인 후 이용해주세요.'})
        return view(**kwargs)
    return wrapped_view


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = SECRET_KEY
    CORS(app)

    import auth
    app.register_blueprint(auth.bp)

    return app