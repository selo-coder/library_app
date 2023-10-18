import pymysql
from flask import request
import jwt
from flask_cors import cross_origin

from backend.routes import routes
from backend.app_data import database_config
from backend.app_data import secret_key
from backend.utils import authenticate_user
from backend.utils import execute_sql_insert


@routes.route('/deleteComment/', methods=['POST'])
@cross_origin()
def delete_comment():
    jwt_token = request.headers.get('Authorization').split()[1]

    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()
    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=secret_key,
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):

            execute_sql_insert(db, cursor,
                               f"DELETE FROM UserCommentUpvotes WHERE userCommentId = '{data.get('userCommentId')}';")

            execute_sql_insert(db, cursor,
                               f"DELETE FROM UserComments WHERE userCommentId = '{data.get('userCommentId')}';")

            return {"message": "User register successful"}, 200

    return {"message": "error"}, 500
