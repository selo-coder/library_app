from flask import request
import pymysql
from flask_cors import cross_origin

from backend.routes import routes
from backend.app_data import database_config
from backend.utils import check_user_authentication, execute_sql_select


@routes.route('/getUserList/', methods=['GET'])
@cross_origin()
def get_user_list():
    if not check_user_authentication(request):
        return {"message": "Authentication Error - Token expired or invalid"}, 401

    cursor = pymysql.connect(**database_config).cursor()

    try:
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
    except:
        return {"message": "Error"}, 500
