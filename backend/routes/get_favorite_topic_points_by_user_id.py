import pymysql
from flask import request
import jwt

from backend.routes import routes
from backend.app_data import database_config
from backend.app_data import secret_key
from backend.utils import authenticate_user
from backend.utils import execute_sql_select


@routes.route('/getFavoriteTopicPointsByUserId/', methods=['GET'])
def get_favorite_topic_points_by_user_id():
    jwt_token = request.headers.get('Authorization').split()[1]
    cursor = pymysql.connect(**database_config).cursor()

    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=secret_key,
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):
            reforged_list = []
            results_subjects = execute_sql_select(cursor,
                                                  f"SELECT s.subjectId, s.subjectTitle FROM FavoriteTopicPoints ftp "
                                                  f"INNER JOIN TopicPoints tp ON tp.topicPointId = ftp.topicPointId "
                                                  f"AND ftp.userId = {request.args.get('userId')} INNER JOIN Topics t "
                                                  f"ON tp.topicId = t.topicId INNER JOIN Subjects s ON s.subjectId = "
                                                  f"t.subjectId group by s.subjectId order by s.subjectId;")

            results = execute_sql_select(cursor, f"SELECT tp.topicPointTitle, tp.content, tp.createdAt, "
                                                 f"t.topicTitle, (select concat(firstName, ' ', lastName) "
                                                 f"from User where id = tp.createdBy), tp.topicPointId, "
                                                 f"(SELECT id "
                                                 f"FROM User WHERE id = tp.createdBy), "
                                                 f"s.subjectId, s.subjectTitle "
                                                 f"FROM FavoriteTopicPoints ftp "
                                                 f"INNER JOIN TopicPoints tp "
                                                 f"ON tp.topicPointId = ftp.topicPointId "
                                                 f"AND ftp.userId = '{request.args.get('userId')}' "
                                                 f"INNER JOIN Topics t ON tp.topicId = t.topicId "
                                                 f"INNER JOIN Subjects s ON s.subjectId = t.subjectId "
                                                 f"order by s.subjectId;")
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
                        'favoriteTopicList': reforged_list}, 200
            elif len(results) == 0:
                return {"message": "List is empty",
                        'favoriteTopicList': []}, 200
    cursor.close()

    return {"message": "Error"}, 500
