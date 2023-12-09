import pymysql
from flask import request
from flask_cors import cross_origin
from backend.routes import routes
from backend.app_data import database_config
from backend.utils import check_user_authentication, execute_sql_insert


@routes.route('/deleteComment/', methods=['POST'])
@cross_origin()
def delete_comment():
    if not check_user_authentication(request):
        return {"message": "Authentication Error - Token expired or invalid"}, 401

    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()

    try:
        execute_sql_insert(db, cursor,
                           f"DELETE FROM UserCommentUpvotes WHERE userCommentId = '{data.get('userCommentId')}';")

        execute_sql_insert(db, cursor,
                           f"DELETE FROM UserComments WHERE userCommentId = '{data.get('userCommentId')}';")

        return {"message": "User register successful"}, 200

    except:
        return {"message": "error"}, 500
