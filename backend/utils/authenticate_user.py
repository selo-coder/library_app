import pymysql

from backend.app_data import database_config
from backend.utils.execute_sql_select import execute_sql_select
import datetime


def authenticate_user(jwt_token_data):
    cursor = pymysql.connect(**database_config).cursor()

    results = execute_sql_select(cursor, "SELECT * FROM User WHERE "
                                         f"email = '{jwt_token_data['user']}';")

    if results and round(datetime.datetime.now().timestamp()) < jwt_token_data['exp']:
        return True
    else:
        return False