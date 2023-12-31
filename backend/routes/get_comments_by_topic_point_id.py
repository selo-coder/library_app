import pymysql
from flask import request
from backend.routes import routes
from backend.app_data import database_config
from backend.utils import check_user_authentication, execute_sql_select


@routes.route('/getCommentsByTopicPointId/', methods=['GET'])
def get_comments_by_topic_point_id():
    if not check_user_authentication(request):
        return {"message": "Authentication Error - Token expired or invalid"}, 401

    cursor = pymysql.connect(**database_config).cursor()

    try:
        results = execute_sql_select(cursor, f"SELECT uc.userCommentId, "
                                             f"concat(u.firstName,' ', u.lastName) as name, "
                                             f"uc.comment, count(ucv.userCommentId) as upvoteCount, "
                                             f"uc.createdAt, uc.userId, uc.imageBase64String "
                                             f"FROM UserComments uc INNER JOIN TopicPoints tp "
                                             f"ON tp.topicPointId = uc.topicPointId "
                                             f"LEFT JOIN UserCommentUpvotes ucv "
                                             f"ON uc.userCommentId = ucv.userCommentId "
                                             f"INNER JOIN User u ON u.id = uc.userId "
                                             f"WHERE uc.topicPointId = '{request.args.get('topicPointId')}' "
                                             f"group by uc.userCommentId;")

        if results and len(results) > 0:
            reforged_list = []

            for x in results:
                reforged_list.append({"userCommentId": x[0],
                                      'name': x[1],
                                      'comment': x[2],
                                      'upvoteCount': x[3],
                                      'createdAt': x[4],
                                      'userId': x[5],
                                      'imageBase64String': str(x[6]) if not str(x[6]) == 'None' else ''})

            return {"message": "Successful",
                    'commentList': reforged_list}, 200
        elif len(results) == 0:
            return {"message": "List is empty",
                    'commentList': []}, 200
    except:
        return {"message": "Error"}, 500
