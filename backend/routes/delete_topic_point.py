import pymysql
from flask import request
import jwt
from flask_cors import cross_origin

from backend.routes import routes
from backend.app_data import database_config
from backend.app_data import secret_key
from backend.utils import authenticate_user
from backend.utils import execute_sql_insert
from backend.utils import execute_sql_select


@routes.route('/deleteTopicPoint/', methods=['POST'])
@cross_origin()
def delete_topic_point():
    jwt_token = request.headers.get('Authorization').split()[1]

    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()
    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=secret_key,
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):

            results = execute_sql_select(cursor,
                                         f"SELECT t.topicId, t.topicTitle, count(*) FROM Topics t LEFT JOIN "
                                         f"TopicPoints tp ON t.topicId = tp.topicId where t.topicId = (SELECT topicId "
                                         f"FROM TopicPoints WHERE topicPointId = '{data.get('topicPointId')}') group by t.topicId;")

            results_delete = execute_sql_select(cursor,
                                         f"SELECT userCommentId FROM UserComments WHERE topicPointId = '{data.get('topicPointId')}'")
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

    return {"message": "error"}, 500
