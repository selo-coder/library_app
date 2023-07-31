import base64

import jwt
import pymysql
from flask import request
from flask_cors import cross_origin

import datetime

from backend.routes import routes
from backend.app_data import database_config
from backend.app_data import secret_key
from backend.utils import authenticate_user, execute_sql_select, execute_sql_insert

from functools import wraps
from flask import request, abort


def limit_content_length(max_length):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            cl = request.content_length
            if cl is not None and cl > max_length:
                abort(413)
            return f(*args, **kwargs)
        return wrapper
    return decorator


@routes.route('/createComment/', methods=['POST'])
@cross_origin()
def create_comment():
    jwt_token = request.headers.get('Authorization').split()[1]


    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()

    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=secret_key,
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):

            execute_sql_insert(db, cursor, f"Insert into UserComments "
                                           f"values (null, "
                                           f"'{data.get('userId')}', "
                                           f"'{data.get('topicPointId')}', "
                                           f"'{data.get('comment')}', "
                                           f"'{datetime.datetime.now()}', "
                                           f"{ chr(39) + data.get('imageBase64String') + chr(39) if isinstance(data.get('imageBase64String'), str) else 'null'});")

            return {"message": "Successful"}, 200

    return {"message": "Error"}, 500
