from flask import request
import pymysql
import jwt
from flask_cors import cross_origin

from backend.routes import routes
from backend.app_data import database_config
from backend.app_data import secret_key
from backend.utils import authenticate_user
from backend.utils import execute_sql_select


@routes.route('/getUserList/', methods=['GET'])
@cross_origin()
def get_user_list():
    jwt_token = request.headers.get('Authorization').split()[1]
    cursor = pymysql.connect(**database_config).cursor()

    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=secret_key,
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):
            results = execute_sql_select(cursor, f"SELECT u.id, concat(u.firstName, ' ', u.lastName), "
                                                 f"tp.maxDate FROM User u "
                                                 f"LEFT JOIN (SELECT createdBy, "
                                                 f"MAX(createdAt) as maxDate FROM TopicPoints "
                                                 f"group by createdBy) tp "
                                                 f"ON tp.createdBy = u.id;")

            if results and len(results) > 0:
                user_list = []
                for x in results:
                    user_list.append({'userId': x[0],
                                      'userName': x[1],
                                      'lastCreatedItemDate': x[2]})
                return {"message": "Successful", 'userList': user_list}, 200
            else:
                return {"message": "Empty List", 'userList': []}, 500

    cursor.close()
    return {"message": "Error"}, 500
