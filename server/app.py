from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return jsonify(status = 'success', result="Hello Flask!!!")

@app.route('/api')
def apiTest():
    result = {
        'name': "nameTest",
        'desc': "desc"
    }
    
    return jsonify(status = 'success', result=result)