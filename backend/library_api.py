import flask_cors
from flask import Flask

from routes import *

import jwt
import datetime

app = Flask(__name__)

flask_cors.CORS(app)

app.config['SECRET_KEY'] = "?1a23aA!§SD!?v!"



@app.route('/getTopicPointsBySubjectTitle/', methods=['GET'])
def get_topic_points_by_subject_title():
    bearer = request.headers.get('Authorization')
    jwt_token = bearer.split()[1]
    cursor = pymysql.connect(**database_config).cursor()

    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=app.config['SECRET_KEY'],
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):
            get_subjectId_result = execute_sql_select(cursor, f"SELECT subjectId "
                                                              f"FROM Subjects WHERE "
                                                              f"subjectTitle = '{request.args.get('subjectTitle')}';")

            favorites_results = execute_sql_select(cursor, f"SELECT topicPointId "
                                                           f"FROM FavoriteTopicPoints "
                                                           f"WHERE userId = '{request.args.get('userId')}';")

            results = execute_sql_select(cursor, f"SELECT tp.topicPointTitle, tp.content, tp.createdAt, "
                                                 f"t.topicTitle, (select concat(firstName, ' ', lastName) "
                                                 f"from User where id = tp.createdBy), tp.topicPointId, "
                                                 f"(SELECT id "
                                                 f"FROM User WHERE id = tp.createdBy) "
                                                 f"FROM Subjects s "
                                                 f"INNER JOIN Topics t "
                                                 f"ON t.subjectId = s.subjectId "
                                                 f"and s.subjectTitle = '{request.args.get('subjectTitle')}' "
                                                 f"INNER JOIN TopicPoints tp "
                                                 f"ON t.topicId = tp.topicId;")

            if results and len(results) > 0:
                reforged_list = []
                for x in results:
                    favorite = False
                    for y in favorites_results:
                        if x[5] == y[0]:
                            favorite = True
                    reforged_list.append(
                        {'topicPointTitle': x[0], 'content': x[1], 'createdAt': x[2], 'topicTitle': x[3],
                         'createdBy': x[4], 'favorite': favorite, 'topicPointId': x[5], 'userId': x[6]})

                return {"message": "Successful",
                        'subjectTitle': request.args.get('subjectTitle'),
                        "subjectId": get_subjectId_result[0][0],
                        'topicPointList': reforged_list}, 200
            elif len(results) == 0:
                return {"message": "List is empty",
                        'subjectTitle': request.args.get('subjectTitle'),
                        "subjectId": get_subjectId_result[0][0],
                        'topicPointList': []}, 200
    cursor.close()

    return {"message": "Error"}, 500


@app.route('/getFavoriteTopicPointsByUserId/', methods=['GET'])
def get_favorite_topic_points_by_user_id():
    bearer = request.headers.get('Authorization')
    jwt_token = bearer.split()[1]
    cursor = pymysql.connect(**database_config).cursor()

    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=app.config['SECRET_KEY'],
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):
            reforged_list = []
            results_subjects = execute_sql_select(cursor,
                                                  f"SELECT s.subjectId, s.subjectTitle FROM FavoriteTopicPoints ftp INNER JOIN TopicPoints tp ON tp.topicPointId = ftp.topicPointId AND ftp.userId = {request.args.get('userId')} INNER JOIN Topics t ON tp.topicId = t.topicId INNER JOIN Subjects s ON s.subjectId = t.subjectId group by s.subjectId order by s.subjectId;")

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
    cursor.close()

    return {"message": "Error"}, 500


@app.route('/getTopicPointsByUserId/', methods=['GET'])
def get_topic_points_by_user_id():
    bearer = request.headers.get('Authorization')
    jwt_token = bearer.split()[1]
    cursor = pymysql.connect(**database_config).cursor()

    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=app.config['SECRET_KEY'],
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):
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
    cursor.close()

    return {"message": "Error"}, 500


@app.route('/getRecentTopicPoints/', methods=['GET'])
def get_recent_topic_points():
    bearer = request.headers.get('Authorization')
    jwt_token = bearer.split()[1]
    cursor = pymysql.connect(**database_config).cursor()

    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=app.config['SECRET_KEY'],
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):
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

    return {"message": "Error"}, 500


@app.route('/getSubjectList/', methods=['GET'])
def get_subject_list():
    bearer = request.headers.get('Authorization')
    jwt_token = bearer.split()[1]
    cursor = pymysql.connect(**database_config).cursor()

    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=app.config['SECRET_KEY'],
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):
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
                                if not results[x][3] in str(subjectList[len(subjectList) - 1]['topicList']):
                                    subjectList[len(subjectList) - 1]['topicList'].append({"topicTitle": results[x][3],
                                                                                           "topicId": results[x][2]})

                            temp_results.remove(results[x])

                return {"message": "Successful", 'subjectList': subjectList}, 200
    cursor.close()
    return {"message": "Error"}, 500


@app.route('/auth/login/', methods=['POST'])
@cross_origin()
def login():
    cursor = pymysql.connect(**database_config).cursor()
    data = request.get_json()

    results = execute_sql_select(cursor, f"SELECT * FROM User WHERE "
                                         f"password = '{data.get('password')}' AND "
                                         f"email = '{data.get('email')}';")
    if results:
        token = jwt.encode({'user': results[0][1], 'userId': results[0][0],
                            'exp': datetime.datetime.now() + datetime.timedelta(minutes=30)},
                           app.config['SECRET_KEY'])

        return jsonify({"message": "Login successful", 'jwt_token': token}), 200
    else:
        return {"message": "Login data wrong"}, 500


@app.route('/deleteTopicPoint/', methods=['POST'])
@cross_origin()
def delete_topic_point():
    bearer = request.headers.get('Authorization')
    jwt_token = bearer.split()[1]

    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()
    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=app.config['SECRET_KEY'],
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):
            print(data.get('topicPointId'))

            results = execute_sql_select(cursor,
                                         f"SELECT t.topicId, t.topicTitle, count(*) FROM Topics t LEFT JOIN "
                                         f"TopicPoints tp ON t.topicId = tp.topicId where t.topicId = (SELECT topicId "
                                         f"FROM TopicPoints WHERE topicPointId = '{data.get('topicPointId')}') group by t.topicId;")
            print(results)
            execute_sql_insert(db, cursor,
                               f"DELETE FROM FavoriteTopicPoints WHERE topicPointId = {data.get('topicPointId')};")

            execute_sql_insert(db, cursor, f"DELETE FROM TopicPoints WHERE topicPointId = {data.get('topicPointId')};")

            if results and results[0][2] == 1:
                execute_sql_insert(db, cursor,
                                   f"DELETE FROM Topics WHERE topicId = {results[0][0]};")

            return {"message": "User register successful"}, 200

    return {"message": "error"}, 500


@app.route('/auth/register/', methods=['POST'])
@cross_origin()
def register():
    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()

    results = execute_sql_select(cursor, f"SELECT * FROM User WHERE email = '{data.get('email')}';")

    if results:
        return {"message": "Email duplicate"}, 500
    else:
        try:

            execute_sql_insert(db, cursor, f"Insert into User values (null, "
                                           f"'{data.get('email')}',"
                                           f"'{data.get('password')}', "
                                           f"'{data.get('firstName')}', "
                                           f"'{data.get('lastName')}');")
        except:
            return {"message": "Error"}, 500

    return {"message": "User register successful"}, 200


@app.route('/changeFavoriteTopicPoint/', methods=['POST'])
@cross_origin()
def change_favorite_topic_point():
    bearer = request.headers.get('Authorization')
    jwt_token = bearer.split()[1]

    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()
    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=app.config['SECRET_KEY'],
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


@app.route('/createTopicPoint/', methods=['POST'])
@cross_origin()
def create_topic_point():
    bearer = request.headers.get('Authorization')
    jwt_token = bearer.split()[1]

    db = pymysql.connect(**database_config)
    cursor = db.cursor()
    data = request.get_json()
    if jwt_token:
        jwt_token_data = jwt.decode(jwt=jwt_token,
                                    key=app.config['SECRET_KEY'],
                                    algorithms=["HS256"])

        if authenticate_user(jwt_token_data):
            if isinstance(data.get('topicTitle'), str) \
                    and isinstance(data.get('topicPointTitle'), str) \
                    and isinstance(data.get('content'), str) \
                    and isinstance(data.get('subjectId'), str) \
                    and isinstance(data.get('userId'), str) \
                    and data.get('createNewTopic') == 'true':

                results = execute_sql_select(cursor, f"SELECT * FROM Topics t "
                                                     f"INNER JOIN Subjects s "
                                                     f"ON s.subjectId = t.subjectId "
                                                     f"WHERE s.SubjectTitle = "
                                                     f"'{data.get('subjectTitle')}' "
                                                     f"AND t.topicTitle = "
                                                     f"'{data.get('topicTitle')}';")

                if results:
                    return {"message": "Duplicate"}, 500

                try:
                    execute_sql_insert(db, cursor, f"INSERT INTO Topics VALUES "
                                                   f"(null, '{data.get('topicTitle')}', "
                                                   f"'{data.get('subjectId')}')")

                    execute_sql_insert(db, cursor, f"INSERT INTO TopicPoints VALUES "
                                                   f"(null, '{data.get('topicPointTitle')}', "
                                                   f"'{data.get('content')}', "
                                                   f"'{cursor.lastrowid}', "
                                                   f"'{datetime.datetime.now()}', "
                                                   f"'{data.get('userId')}')")

                except:
                    return {"message": "Error"}, 500

                return {"message": "Successful"}, 200

            elif isinstance(data.get('topicId'), str) \
                    and isinstance(data.get('subjectId'), str) \
                    and isinstance(data.get('topicPointTitle'), str) \
                    and isinstance(data.get('content'), str) \
                    and data.get('createNewTopic') == 'false':

                results = execute_sql_select(cursor, f"SELECT * FROM TopicPoints tp "
                                                     f"INNER JOIN Topics t ON tp.topicId = t.topicId "
                                                     f"INNER JOIN Subjects s ON s.subjectId = t.subjectId "
                                                     f"WHERE tp.topicPointTitle = '{data.get('topicPointTitle')}' "
                                                     f"AND tp.topicId = '{data.get('topicId')}' "
                                                     f"AND t.subjectId = '{data.get('subjectId')}';")

                if results and len(results) > 0:
                    return {"message": "Duplicate"}, 500
                try:
                    execute_sql_insert(db, cursor, f"INSERT INTO TopicPoints VALUES "
                                                   f"(null, '{data.get('topicPointTitle')}', "
                                                   f"'{data.get('content')}', "
                                                   f"'{data.get('topicId')}', "
                                                   f"'{datetime.datetime.now()}', "
                                                   f"'{data.get('userId')}')")
                except:
                    return {"message": "Error"}, 500

                return {"message": "Successful"}, 200

    return {"message": "Error"}, 500


app.register_blueprint(routes)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
