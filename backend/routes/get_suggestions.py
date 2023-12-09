import pymysql
from flask import request
from backend.routes import routes
from backend.app_data import database_config
from backend.utils import execute_sql_select, check_user_authentication


@routes.route('/getSuggestions/', methods=['GET'])
def get_suggestions():
    if not check_user_authentication(request):
        return {"message": "Authentication Error - Token expired or invalid"}, 401

    cursor = pymysql.connect(**database_config).cursor()

    try:
        if request.args.get('searchText'):
            results = execute_sql_select(cursor,
                                         f"SELECT * FROM TopicPoints tp "
                                         f"INNER JOIN Topics t "
                                         f"on t.topicId = tp.topicId "
                                         f"INNER JOIN Subjects s "
                                         f"on t.subjectId = s.subjectId "
                                         f"WHERE tp.topicPointTitle "
                                         f"LIKE '%{request.args.get('searchText')}%' LIMIT 10;")

            reforged_list = []

            for x in results:
                reforged_list.append({'suggestionUrl':  '/' + x[10] + '/' + x[7] + '/' + x[1],
                                      'suggestionText': x[1],
                                      })

            return {"message": "successful", "suggestions_List": reforged_list}, 200

    except:
        return {"message": "Error"}, 500
