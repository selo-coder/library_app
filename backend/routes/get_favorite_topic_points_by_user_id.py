import pymysql
from flask import request
from backend.routes import routes
from backend.app_data import database_config
from backend.utils import check_user_authentication, execute_sql_select


@routes.route('/getFavoriteTopicPointsByUserId/', methods=['GET'])
def get_favorite_topic_points_by_user_id():
    if not check_user_authentication(request):
        return {"message": "Authentication Error - Token expired or invalid"}, 401

    cursor = pymysql.connect(**database_config).cursor()

    try:
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
    except:
        return {"message": "Error"}, 500
