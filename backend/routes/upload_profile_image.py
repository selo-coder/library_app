import pymysql
from flask_cors import cross_origin
from backend.routes import routes
from backend.app_data import database_config
from backend.utils import execute_sql_insert, check_user_authentication
from flask import request


@routes.route('/uploadProfileImage/', methods=['POST'])
@cross_origin()
def upload_profile_image():
    if not check_user_authentication(request):
        return {"message": "Authentication Error - Token expired or invalid"}, 401

    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()

    try:
        execute_sql_insert(db, cursor,
                           f"UPDATE User SET profileImage = {chr(39) + data.get('imageBase64String') + chr(39) if isinstance(data.get('imageBase64String'), str) else 'null'} "
                           f"WHERE id = '{data.get('userId')}';")

        return {"message": "Successful"}, 200
    except:
        return {"message": "Error"}, 500





