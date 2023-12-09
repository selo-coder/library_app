import pymysql
from flask import request
from flask_cors import cross_origin
from backend.routes import routes
from backend.app_data import database_config
from backend.utils import execute_sql_insert, execute_sql_select, check_user_authentication


@routes.route('/updateUserData/', methods=['POST'])
@cross_origin()
def update_user_data():
    if not check_user_authentication(request):
        return {"message": "Authentication Error - Token expired or invalid"}, 401

    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()

    try:
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
                                               f"SELECT * FROM User WHERE email = '{data.get('newEmail')}';")
            if email_results:
                return {"message": "newEmailWrong"}, 500

        if isinstance(data.get('newEmail'), str) or isinstance(data.get('newPassword'), str):
            execute_sql_insert(db, cursor, f"UPDATE User SET "
                                           f"{'password = ' + chr(39) + data.get('newPassword') + chr(39) if isinstance(data.get('newPassword'), str) else ''}"
                                           f"{', ' if isinstance(data.get('newPassword'), str) and isinstance(data.get('newEmail'), str) else ''}"
                                           f"{'email = ' + chr(39) + data.get('newEmail') + chr(39) if isinstance(data.get('newEmail'), str) else ''}"
                                           f" WHERE id = {data.get('userId')};")

            return {"message": "User data changed"}, 200
        else:
            return {"message": "noNewDataGiven"}, 500
    except:
        return {"message": "error"}, 500
