import flask_cors
from flask import Flask

from backend.routes import *

app = Flask(__name__)

flask_cors.CORS(app)

app.register_blueprint(routes)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
