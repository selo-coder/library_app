import pymysql
from flask import request, jsonify
import jwt
from flask_cors import cross_origin
import datetime
from backend.routes import routes
from backend.app_data import database_config, secret_key
from backend.utils import execute_sql_select


@routes.route('/auth/login/', methods=['POST'])
@cross_origin()
def login():
    cursor = pymysql.connect(**database_config).cursor()
    data = request.get_json()

    results = execute_sql_select(cursor, f"SELECT * FROM User WHERE "
                                         f"password = '{data.get('password')}' AND "
                                         f"email = '{data.get('email')}';")
    if results:
        token = jwt.encode({'user': results[0][1], 'userId': results[0][0],
                            'exp': datetime.datetime.now() + datetime.timedelta(minutes=30)},
                           secret_key)

        return jsonify({"message": "Login successful", 'jwt_token': token}), 200
    else:
        return {"message": "Login data wrong"}, 500
