def execute_sql_insert(db, cursor, sql_statement):
    cursor.connection.ping()
    cursor.execute(sql_statement)
    db.commit()
