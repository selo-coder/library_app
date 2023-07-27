def execute_sql_select(cursor, sql_statement):
    cursor.connection.ping()
    cursor.execute(sql_statement)
    return cursor.fetchall()