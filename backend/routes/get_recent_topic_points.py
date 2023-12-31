import pymysql
from flask import request
from backend.routes import routes
from backend.app_data import database_config
from backend.utils import check_user_authentication, execute_sql_select


@routes.route('/getRecentTopicPoints/', methods=['GET'])
def get_recent_topic_points():
    if not check_user_authentication(request):
        return {"message": "Authentication Error - Token expired or invalid"}, 401

    cursor = pymysql.connect(**database_config).cursor()

    try:
        favorites_results = execute_sql_select(cursor, f"SELECT topicPointId "
                                                       f"FROM FavoriteTopicPoints "
                                                       f"WHERE userId = '{request.args.get('userId')}';")

        results = execute_sql_select(cursor, f"SELECT tp.topicPointTitle, tp.content, tp.createdAt, "
                                             f"t.topicTitle, (select concat(firstName, ' ', lastName) "
                                             f"from User where id = tp.createdBy), tp.topicPointId, "
                                             f"s.subjectTitle, s.subjectId, "
                                             f"(SELECT id "
                                             f"FROM User WHERE id = tp.createdBy) "
                                             f"FROM Subjects s "
                                             f"INNER JOIN Topics t "
                                             f"ON t.subjectId = s.subjectId "
                                             f"INNER JOIN TopicPoints tp "
                                             f"ON t.topicId = tp.topicId "
                                             f"order by tp.createdAt desc "
                                             f"LIMIT 10;")

        if results and len(results) > 0:
            reforged_list = []
            for x in results:
                favorite = False
                for y in favorites_results:
                    if x[5] == y[0]:
                        favorite = True
                reforged_list.append(
                    {'topicPointTitle': x[0], 'content': x[1],
                     'createdAt': x[2], 'topicTitle': x[3],
                     'createdBy': x[4], 'favorite': favorite,
                     'topicPointId': x[5], 'subjectTitle': x[6],
                     'subjectId': x[7], 'userId': x[8]})

            return {"message": "Successful",
                    'recentTopicPointList': reforged_list}, 200
        elif len(results) == 0:
            return {"message": "List is empty",
                    'recentTopicPointList': []}, 200
    except:
        return {"message": "Error"}, 500
