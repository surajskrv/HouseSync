from flask import Flask
from application.database import db
from application.models import User, Role
from application.config import LocalDevelopmentConfig
from flask_security import Security, SQLAlchemyUserDatastore
from flask_cors import CORS

app = None

def start():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)
    CORS(app)
    db.init_app(app)
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    app.app_context().push()
    
    return app
    
app = start()

from application.create_data import *
from application.routes import *   

if __name__ == '__main__':
    app.run()