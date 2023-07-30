import pymysql
from flask import request
import jwt

from backend.routes import routes
from backend.app_data import database_config
from backend.app_data import secret_key
from backend.utils import authenticate_user
from backend.utils import execute_sql_select


@routes.route('/getSubjectList/', methods=['GET'])
def get_subject_list():
    jwt_token = request.headers.get('Authorization').split()[1]
    cursor = pymysql.connect(**database_config).cursor()

    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=secret_key,
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):
            results = execute_sql_select(cursor, f"SELECT * FROM Subjects s "
                                                 f"LEFT JOIN Topics t "
                                                 f"ON t.subjectId = s.subjectId;")

            if results and len(results) > 0:
                subjectList = []
                temp_results = list(results)

                for index, result_item in enumerate(results):
                    results = tuple(temp_results)
                    for x in range(0, len(results)):
                        if results[x][0] == index:

                            if not subjectList or subjectList[len(subjectList) - 1]['subjectTitle'] != results[x][1]:
                                subjectList.append({'subjectId': results[x][0],
                                                    'subjectTitle': results[x][1],
                                                    'topicList': []})

                            if isinstance(results[x][3], str):
                                subjectList[len(subjectList) - 1]['topicList'].append({"topicTitle": results[x][3],
                                                                                       "topicId": results[x][2]})

                            temp_results.remove(results[x])

                return {"message": "Successful", 'subjectList': subjectList}, 200
    cursor.close()
    return {"message": "Error"}, 500
