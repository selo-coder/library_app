import pymysql
from flask import request
import jwt

from backend.routes import routes
from backend.app_data import database_config
from backend.app_data import secret_key
from backend.utils import authenticate_user
from backend.utils import execute_sql_select


@routes.route('/getTopicPointsByUserId/', methods=['GET'])
def get_topic_points_by_user_id():
    jwt_token = request.headers.get('Authorization').split()[1]
    cursor = pymysql.connect(**database_config).cursor()

    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=secret_key,
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):
            reforged_list = []
            results_subjects = execute_sql_select(cursor,
                                                  f"SELECT s.subjectId, s.subjectTitle "
                                                  f"FROM TopicPoints tp INNER JOIN Topics t "
                                                  f"ON tp.topicId = t.topicId "
                                                  f"AND tp.createdBy = '{request.args.get('userId')}' "
                                                  f"INNER JOIN Subjects s ON s.subjectId = t.subjectId "
                                                  f"group by s.subjectId order by s.subjectId;")

            results = execute_sql_select(cursor, f"SELECT tp.topicPointTitle, tp.content, tp.createdAt, "
                                                 f"t.topicTitle, (select concat(firstName, ' ', lastName) "
                                                 f"from User where id = tp.createdBy), tp.topicPointId, "
                                                 f"(SELECT id "
                                                 f"FROM User WHERE id = tp.createdBy), s.subjectId "
                                                 f"FROM TopicPoints tp INNER JOIN Topics t "
                                                 f"ON tp.topicId = t.topicId INNER JOIN Subjects s "
                                                 f"ON s.subjectId = t.subjectId "
                                                 f"WHERE tp.createdBy = '{request.args.get('userId')}';")

            if results and len(results) > 0:
                for y in results_subjects:
                    temp_list = []
                    for x in results:
                        if y[0] == x[7]:
                            temp_list.append(
                                {'topicPointTitle': x[0], 'content': x[1], 'createdAt': x[2], 'topicTitle': x[3],
                                 'createdBy': x[4], 'favorite': True, 'topicPointId': x[5], 'userId': x[6]})

                    reforged_list.append({'subjectId': y[0],
                                          'subjectTitle': y[1],
                                          'topicPointList': temp_list})

                return {"message": "Successful",
                        'topicPointList': reforged_list}, 200
            elif len(results) == 0:
                return {"message": "List is empty",
                        'topicPointList': []}, 200
    cursor.close()

    return {"message": "Error"}, 500
