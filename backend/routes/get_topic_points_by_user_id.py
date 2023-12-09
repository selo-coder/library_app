import pymysql
from flask import request
from backend.routes import routes
from backend.app_data import database_config
from backend.utils import check_user_authentication, execute_sql_select


@routes.route('/getTopicPointsByUserId/', methods=['GET'])
def get_topic_points_by_user_id():
    if not check_user_authentication(request):
        return {"message": "Authentication Error - Token expired or invalid"}, 401

    cursor = pymysql.connect(**database_config).cursor()

    try:
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
    except:
        return {"message": "Error"}, 500
