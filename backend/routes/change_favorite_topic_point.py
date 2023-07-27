import jwt
import pymysql
from flask import request
from flask_cors import cross_origin

from backend.routes import routes
from backend.app_data import database_config
from backend.app_data import secret_key
from backend.utils import authenticate_user
from backend.utils import execute_sql_insert
from backend.utils import execute_sql_select


@routes.route('/changeFavoriteTopicPoint/', methods=['POST'])
@cross_origin()
def change_favorite_topic_point():
    jwt_token = request.headers.get('Authorization').split()[1]

    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()
    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=secret_key,
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):
            try:
                if data.get('favorite') == 'true':
                    results = execute_sql_select(cursor, f"SELECT * FROM FavoriteTopicPoints "
                                                         f"WHERE topicPointId = {data.get('topicPointId')} "
                                                         f"AND userId = {data.get('userId')};")

                    if results:
                        execute_sql_insert(db, cursor, f"DELETE FROM FavoriteTopicPoints "
                                                       f"WHERE userId = '{data.get('userId')}' "
                                                       f"AND topicPointId = '{data.get('topicPointId')}'")

                        return {"message": "successful"}, 200
                elif data.get('favorite') == 'false':
                    results = execute_sql_select(cursor, f"SELECT * FROM FavoriteTopicPoints "
                                                         f"WHERE topicPointId = {data.get('topicPointId')} "
                                                         f"AND userId = {data.get('userId')};")
                    if not results:
                        execute_sql_insert(db, cursor, f"Insert into FavoriteTopicPoints "
                                                       f"values ('{data.get('userId')}', "
                                                       f"'{data.get('topicPointId')}');")

                        return {"message": "successful"}, 200
            except:
                return {"message": "error"}, 500

    return {"message": "error"}, 500
