import pymysql
from flask import request
from backend.routes import routes
from backend.app_data import database_config
from backend.utils import check_user_authentication, execute_sql_select


@routes.route('/getSubjectList/', methods=['GET'])
def get_subject_list():
    if not check_user_authentication(request):
        return {"message": "Authentication Error - Token expired or invalid"}, 401

    cursor = pymysql.connect(**database_config).cursor()

    try:
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
    except:
        return {"message": "Error"}, 500
