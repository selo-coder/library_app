import jwt
import pymysql
import datetime
from backend.app_data import database_config, secret_key
from backend.utils import execute_sql_select


def check_user_authentication(request):
    if not request.headers.get('Authorization') or len(request.headers.get('Authorization').split()) < 2:
        return False
    else:
        jwt_token = request.headers.get('Authorization').split()[1]
        if not jwt_token:
            return False
        else:
            try:
                jwt_token_data = jwt.decode(jwt=jwt_token,
                                            key=secret_key,
                                            algorithms=["HS256"])

                cursor = pymysql.connect(**database_config).cursor()

                results = execute_sql_select(cursor, "SELECT * FROM User WHERE "
                                                     f"id = '{jwt_token_data['userId']}';")

                if not results or not round(datetime.datetime.now().timestamp()) < jwt_token_data['exp']:
                    return False
            except:
                return False
    return True
