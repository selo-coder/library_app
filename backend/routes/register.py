import pymysql
from flask import request
from flask_cors import cross_origin

from backend.routes import routes
from backend.app_data import database_config
from backend.utils import execute_sql_insert
from backend.utils import execute_sql_select


@routes.route('/auth/register/', methods=['POST'])
@cross_origin()
def register():
    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()

    results = execute_sql_select(cursor, f"SELECT * FROM User WHERE email = '{data.get('email')}';")

    if results:
        return {"message": "Email duplicate"}, 500
    else:
        try:
            execute_sql_insert(db, cursor, f"Insert into User values (null, "
                                           f"'{data.get('email')}',"
                                           f"'{data.get('password')}', "
                                           f"'{data.get('firstName')}', "
                                           f"'{data.get('lastName')}');")
        except:
            return {"message": "Error"}, 500

    return {"message": "User register successful"}, 200
