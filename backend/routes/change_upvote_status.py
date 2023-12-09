import pymysql
from flask import request
from flask_cors import cross_origin
from backend.routes import routes
from backend.app_data import database_config
from backend.utils import execute_sql_select, check_user_authentication, execute_sql_insert


@routes.route('/changeUpvoteStatus/', methods=['POST'])
@cross_origin()
def change_upvote_status():
    if not check_user_authentication(request):
        return {"message": "Authentication Error - Token expired or invalid"}, 401

    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()

    try:
        results = execute_sql_select(cursor, f"SELECT * FROM UserCommentUpvotes "
                                             f"WHERE userId = '{data.get('userId')}' "
                                             f"AND userCommentId = '{data.get('userCommentId')}'")

        if not results:
            try:
                execute_sql_insert(db, cursor, f"Insert into UserCommentUpvotes "
                                               f"values ('{data.get('userId')}', "
                                               f"'{data.get('userCommentId')}');")

                return {"message": "Successfully added upvote"}, 200
            except:
                return {"message": "error"}, 500

        else:
            execute_sql_insert(db, cursor, f"DELETE FROM UserCommentUpvotes "
                                           f"WHERE userId = '{data.get('userId')}' "
                                           f"AND userCommentId = '{data.get('userCommentId')}';")
            return {"message": "Successfully removed upvote"}, 200
    except:
        return {"message": "Error"}, 500
