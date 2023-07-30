import jwt
import pymysql
from flask import request
from flask_cors import cross_origin

import datetime

from backend.routes import routes
from backend.app_data import database_config
from backend.app_data import secret_key
from backend.utils import authenticate_user
from backend.utils import execute_sql_insert
from backend.utils import execute_sql_select


@routes.route('/createTopicPoint/', methods=['POST'])
@cross_origin()
def create_topic_point():
    jwt_token = request.headers.get('Authorization').split()[1]

    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()
    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=secret_key,
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):
            if isinstance(data.get('topicTitle'), str) \
                    and isinstance(data.get('topicPointTitle'), str) \
                    and isinstance(data.get('content'), str) \
                    and isinstance(data.get('subjectId'), str) \
                    and isinstance(data.get('userId'), str) \
                    and data.get('createNewTopic') == 'true':

                results = execute_sql_select(cursor, f"SELECT * FROM Topics "
                                                     f"WHERE topicTitle = '{data.get('topicTitle')}' "
                                                     f"and subjectId = '{data.get('subjectId')}';")
                # duplicate topic !
                if results:
                    return {"message": "Duplicate"}, 500

                try:
                    execute_sql_insert(db, cursor, f"INSERT INTO Topics VALUES "
                                                   f"(null, '{data.get('topicTitle')}', "
                                                   f"'{data.get('subjectId')}')")

                    execute_sql_insert(db, cursor, f"INSERT INTO TopicPoints VALUES "
                                                   f"(null, '{data.get('topicPointTitle')}', "
                                                   f"'{data.get('content')}', "
                                                   f"'{cursor.lastrowid}', "
                                                   f"'{datetime.datetime.now()}', "
                                                   f"'{data.get('userId')}')")

                except:
                    return {"message": "Error"}, 500

                return {"message": "Successful"}, 200

            elif isinstance(data.get('topicId'), str) \
                    and isinstance(data.get('subjectId'), str) \
                    and isinstance(data.get('topicPointTitle'), str) \
                    and isinstance(data.get('content'), str) \
                    and data.get('createNewTopic') == 'false':

                results = execute_sql_select(cursor, f"SELECT * FROM TopicPoints tp "
                                                     f"INNER JOIN Topics t ON tp.topicId = t.topicId "
                                                     f"INNER JOIN Subjects s ON s.subjectId = t.subjectId "
                                                     f"WHERE tp.topicPointTitle = '{data.get('topicPointTitle')}' "
                                                     f"AND tp.topicId = '{data.get('topicId')}' "
                                                     f"AND t.subjectId = '{data.get('subjectId')}';")
                # duplicate topicPoint !
                if results and len(results) > 0:
                    return {"message": "Duplicate"}, 500
                try:
                    execute_sql_insert(db, cursor, f"INSERT INTO TopicPoints VALUES "
                                                   f"(null, '{data.get('topicPointTitle')}', "
                                                   f"'{data.get('content')}', "
                                                   f"'{data.get('topicId')}', "
                                                   f"'{datetime.datetime.now()}', "
                                                   f"'{data.get('userId')}')")
                except:
                    return {"message": "Error"}, 500

                return {"message": "Successful"}, 200

    return {"message": "Error"}, 500
