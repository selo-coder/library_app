import datetime

import jwt
import pymysql
from flask import request
from flask_cors import cross_origin

from backend.routes import routes
from backend.app_data import database_config
from backend.app_data import secret_key
from backend.utils import authenticate_user, execute_sql_select, execute_sql_insert


@routes.route('/editTopicPoint/', methods=['POST'])
@cross_origin()
def edit_topic_point():
    jwt_token = request.headers.get('Authorization').split()[1]

    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()
    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=secret_key,
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):

            if (isinstance(data.get('topicPointId'), str)) \
                    and (isinstance(data.get('topicId'), str)
                         or isinstance(data.get('topicTitle'), str)
                         or isinstance(data.get('content'), str)
                         or isinstance(data.get('topicPointTitle'), str)):

                delete_results = execute_sql_select(cursor,
                                                    f"SELECT t.topicId, t.topicTitle, count(*) FROM Topics t LEFT JOIN "
                                                    f"TopicPoints tp ON t.topicId = tp.topicId "
                                                    f"where t.topicId = (SELECT topicId "
                                                    f"FROM TopicPoints "
                                                    f"WHERE topicPointId = '{data.get('topicPointId')}') "
                                                    f"group by t.topicId;")

                if data.get('createNewTopic') == 'false':
                    try:
                        execute_sql_insert(db, cursor, f"UPDATE TopicPoints SET createdAt = '{datetime.datetime.now()}'"
                                                       f"{', topicId = ' + chr(39) + data.get('topicId') + chr(39) if isinstance(data.get('topicId'), str) else ''}"
                                                       f"{', content = ' + chr(39) + data.get('content') + chr(39) if isinstance(data.get('content'), str) else ''}"
                                                       f"{', topicPointTitle = ' + chr(39) + data.get('topicPointTitle') + chr(39) if isinstance(data.get('topicPointTitle'), str) else ''}"
                                                       f" WHERE topicPointId = {data.get('topicPointId')};")

                        if delete_results and delete_results[0][2] == 1:
                            execute_sql_insert(db, cursor,
                                               f"DELETE FROM Topics WHERE topicId = {delete_results[0][0]};")
                        return {"message": "successful"}, 200

                    except:
                        return {"message": "error"}, 500

                elif data.get('createNewTopic') == 'true' and isinstance(data.get('topicTitle'), str) and isinstance(
                        data.get('topicTitle'), str):

                    subject_title_results = execute_sql_select(cursor,
                                                               f"SELECT subjectTitle FROM Subjects WHERE subjectId = '{data.get('subjectId')}'")

                    results = execute_sql_select(cursor, f"SELECT * FROM Topics t "
                                                         f"INNER JOIN Subjects s "
                                                         f"ON s.subjectId = t.subjectId "
                                                         f"WHERE s.SubjectTitle = "
                                                         f"'{subject_title_results[0][0]}' "
                                                         f"AND t.topicTitle = "
                                                         f"'{data.get('topicTitle')}';")

                    if results:
                        return {"message": "Duplicate"}, 500

                    try:
                        execute_sql_insert(db, cursor, f"INSERT INTO Topics VALUES "
                                                       f"(null, '{data.get('topicTitle')}', "
                                                       f"'{data.get('subjectId')}')")

                        execute_sql_insert(db, cursor, f"UPDATE TopicPoints SET createdAt = '{datetime.datetime.now()}'"
                                                       f"{', topicId = ' + chr(39) + str(cursor.lastrowid) + chr(39) if isinstance(str(cursor.lastrowid), str) else ''}"
                                                       f"{', content = ' + chr(39) + data.get('content') + chr(39) if isinstance(data.get('content'), str) else ''}"
                                                       f"{', topicPointTitle = ' + chr(39) + data.get('topicPointTitle') + chr(39) if isinstance(data.get('topicPointTitle'), str) else ''}"
                                                       f" WHERE topicPointId = {data.get('topicPointId')};")

                        if delete_results and delete_results[0][2] == 1:
                            execute_sql_insert(db, cursor,
                                               f"DELETE FROM Topics WHERE topicId = {delete_results[0][0]};")

                    except:
                        return {"message": "Error"}, 500

                    return {"message": "successful"}, 200

            else:
                return {"message": "no data was given"}, 500

    return {"message": "error2"}, 500
