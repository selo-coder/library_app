import pymysql
from flask import request
import jwt

from backend.routes import routes
from backend.app_data import database_config
from backend.app_data import secret_key
from backend.utils import authenticate_user
from backend.utils import execute_sql_select


@routes.route('/getTopicPointsBySubjectTitle/', methods=['GET'])
def get_topic_points_by_subject_title():
    jwt_token = request.headers.get('Authorization').split()[1]
    cursor = pymysql.connect(**database_config).cursor()

    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=secret_key,
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):
            get_subjectId_result = execute_sql_select(cursor, f"SELECT subjectId "
                                                              f"FROM Subjects WHERE "
                                                              f"subjectTitle = '{request.args.get('subjectTitle')}';")

            favorites_results = execute_sql_select(cursor, f"SELECT topicPointId "
                                                           f"FROM FavoriteTopicPoints "
                                                           f"WHERE userId = '{request.args.get('userId')}';")

            results = execute_sql_select(cursor, f"SELECT tp.topicPointTitle, tp.content, tp.createdAt, "
                                                 f"t.topicTitle, (select concat(firstName, ' ', lastName) "
                                                 f"from User where id = tp.createdBy), tp.topicPointId, "
                                                 f"(SELECT id "
                                                 f"FROM User WHERE id = tp.createdBy) "
                                                 f"FROM Subjects s "
                                                 f"INNER JOIN Topics t "
                                                 f"ON t.subjectId = s.subjectId "
                                                 f"and s.subjectTitle = '{request.args.get('subjectTitle')}' "
                                                 f"INNER JOIN TopicPoints tp "
                                                 f"ON t.topicId = tp.topicId;")

            if results and len(results) > 0:
                reforged_list = []
                for x in results:
                    favorite = False
                    for y in favorites_results:
                        if x[5] == y[0]:
                            favorite = True
                    reforged_list.append(
                        {'topicPointTitle': x[0], 'content': x[1], 'createdAt': x[2], 'topicTitle': x[3],
                         'createdBy': x[4], 'favorite': favorite, 'topicPointId': x[5], 'userId': x[6]})

                return {"message": "Successful",
                        'subjectTitle': request.args.get('subjectTitle'),
                        "subjectId": get_subjectId_result[0][0],
                        'topicPointList': reforged_list}, 200
            elif len(results) == 0:
                return {"message": "List is empty",
                        'subjectTitle': request.args.get('subjectTitle'),
                        "subjectId": get_subjectId_result[0][0],
                        'topicPointList': []}, 200
    cursor.close()

    return {"message": "Error"}, 500
