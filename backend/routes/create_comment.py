import pymysql
from flask_cors import cross_origin
import datetime
from backend.routes import routes
from backend.app_data import database_config
from backend.utils import execute_sql_insert, check_user_authentication
from flask import request


@routes.route('/createComment/', methods=['POST'])
@cross_origin()
def create_comment():
    if not check_user_authentication(request):
        return {"message": "Authentication Error - Token expired or invalid"}, 401

    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()

    try:
        execute_sql_insert(db, cursor, f"Insert into UserComments "
                                       f"values (null, "
                                       f"'{data.get('userId')}', "
                                       f"'{data.get('topicPointId')}', "
                                       f"'{data.get('comment')}', "
                                       f"'{datetime.datetime.now()}', "
                                       f"{ chr(39) + data.get('imageBase64String') + chr(39) if isinstance(data.get('imageBase64String'), str) else 'null'});")

        return {"message": "Successful"}, 200

    except:
        return {"message": "Error"}, 500
