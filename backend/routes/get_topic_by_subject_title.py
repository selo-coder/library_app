import pymysql
from flask import request
import jwt

from backend.routes import routes
from backend.app_data import database_config
from backend.app_data import secret_key
from backend.utils import authenticate_user
from backend.utils import execute_sql_select


@routes.route('/getTopicsBySubjectTitle/', methods=['GET'])
def get_topic_by_subject_title():
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

            results = execute_sql_select(cursor, f"SELECT t.topicTitle, t.topicId, s.subjectId FROM Subjects s "
                                                 f"INNER JOIN Topics t "
                                                 f"ON t.subjectId = s.subjectId and "
                                                 f"s.subjectTitle = '{request.args.get('subjectTitle')}';")

            if results and len(results) > 0:
                reforged_list = []

                for x in results:
                    reforged_list.append({'topicTitle': x[0],
                                          'topicId': x[1]})

                return {"message": "Successful",
                        'subjectTitle': request.args.get('subjectTitle'),
                        "subjectId": get_subjectId_result[0][0],
                        'topicList': reforged_list}, 200
            elif len(results) == 0:
                return {"message": "List is empty",
                        'subjectTitle': request.args.get('subjectTitle'),
                        "subjectId": get_subjectId_result[0][0],
                        'topicList': results}, 200
    cursor.close()
    return {"message": "Error"}, 500
