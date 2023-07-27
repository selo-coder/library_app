import os

is_docker = os.environ.get('AM_I_IN_A_DOCKER_CONTAINER', False)

database_config = {}

if not is_docker:
    database_config = {
        "host": "127.0.0.1",
        "user": "Root_User",
        "password": "passw0rd",
        "db": "database_library",
        "port": 3306
    }
else:
    database_config = {
        "host": "library-app-database",
        "user": "Root_User",
        "password": "passw0rd",
        "db": "database_library",
        "port": 3306
    }
