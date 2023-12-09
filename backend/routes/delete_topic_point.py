import pymysql
from flask import request
from flask_cors import cross_origin
from backend.routes import routes
from backend.app_data import database_config
from backend.utils import check_user_authentication, execute_sql_select, execute_sql_insert


@routes.route('/deleteTopicPoint/', methods=['POST'])
@cross_origin()
def delete_topic_point():
    if not check_user_authentication(request):
        return {"message": "Authentication Error - Token expired or invalid"}, 401

    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()

    try:
        results = execute_sql_select(cursor,
                                     f"SELECT t.topicId, t.topicTitle, count(*) FROM Topics t LEFT JOIN "
                                     f"TopicPoints tp ON t.topicId = tp.topicId where t.topicId = (SELECT topicId "
                                     f"FROM TopicPoints WHERE topicPointId = '{data.get('topicPointId')}') group by "
                                     f"t.topicId;")

        results_delete = execute_sql_select(cursor,
                                            f"SELECT userCommentId FROM UserComments "
                                            f"WHERE topicPointId = '{data.get('topicPointId')}'")
        for x in results_delete:
            execute_sql_insert(db, cursor,
                               f"DELETE FROM UserCommentUpvotes WHERE userCommentId = '{x[0]}';")

        execute_sql_insert(db, cursor,
                           f"DELETE FROM UserComments WHERE topicPointId = '{data.get('topicPointId')}';")

        execute_sql_insert(db, cursor,
                           f"DELETE FROM FavoriteTopicPoints WHERE topicPointId = {data.get('topicPointId')};")

        execute_sql_insert(db, cursor, f"DELETE FROM TopicPoints WHERE topicPointId = {data.get('topicPointId')};")

        if results and results[0][2] == 1:
            execute_sql_insert(db, cursor,
                               f"DELETE FROM Topics WHERE topicId = {results[0][0]};")

        return {"message": "User register successful"}, 200

    except:
        return {"message": "error"}, 500
