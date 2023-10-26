import pymysql
from flask import request
import jwt

from backend.routes import routes
from backend.app_data import database_config
from backend.app_data import secret_key
from backend.utils import authenticate_user, execute_sql_select


@routes.route('/getSuggestions/', methods=['GET'])
def get_suggestions():
    jwt_token = request.headers.get('Authorization').split()[1]
    cursor = pymysql.connect(**database_config).cursor()

    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=secret_key,
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):
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

    cursor.close()
    return {"message": "Error"}, 500
