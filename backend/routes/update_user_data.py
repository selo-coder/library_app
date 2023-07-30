import jwt
import pymysql
from flask import request
from flask_cors import cross_origin

from backend.routes import routes
from backend.app_data import database_config, secret_key
from backend.utils import execute_sql_insert, authenticate_user, execute_sql_select


@routes.route('/updateUserData/', methods=['POST'])
@cross_origin()
def update_user_data():
    jwt_token = request.headers.get('Authorization').split()[1]

    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()

    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=secret_key,
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):
            userId_results = execute_sql_select(cursor,
                                                f"SELECT password, email "
                                                f"FROM User WHERE id = '{data.get('userId')}';")

            if isinstance(data.get('newPassword'), str):
                if not userId_results[0][0] == data.get('oldPassword'):
                    return {"message": "oldPasswordWrong"}, 500

                password_results = execute_sql_select(cursor,
                                                      f"SELECT * FROM User WHERE password = '{data.get('newPassword')}' "
                                                      f"and id = '{data.get('userId')}';")
                if password_results:
                    return {"message": "passwordNotChanged"}, 500

            if isinstance(data.get('newEmail'), str):
                if not userId_results[0][1] == data.get('oldEmail'):
                    return {"message": "oldEmailWrong"}, 500

                email_results = execute_sql_select(cursor,
                                                   f"SELECT * FROM User WHERE email = '{data.get('newEmail')}' "
                                                   f"and id = '{data.get('userId')}';")
                if email_results:
                    return {"message": "emailNotChanged"}, 500

            if isinstance(data.get('newEmail'), str) or isinstance(data.get('newPassword'), str):
                execute_sql_insert(db, cursor, f"UPDATE User SET "
                                               f"{'password = ' + chr(39) + data.get('newPassword') + chr(39) if isinstance(data.get('newPassword'), str) else ''}"
                                               f"{', ' if isinstance(data.get('newPassword'), str) and isinstance(data.get('newEmail'), str) else ''}"
                                               f"{'email = ' + chr(39) + data.get('newEmail') + chr(39) if isinstance(data.get('newEmail'), str) else ''}"
                                               f" WHERE id = {data.get('userId')};")

                return {"message": "User data changed"}, 200
            else:
                return {"message": "noNewDataGiven"}, 500

    return {"message": "error"}, 500
