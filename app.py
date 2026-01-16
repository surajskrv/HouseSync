from flask import Flask
from application.extensions import db
from application.models import User, Role
from application.config import LocalDevelopmentConfig, ProductionConfig
from application.create_data import create_initial_data
from flask_security import Security, SQLAlchemyUserDatastore
from flask_cors import CORS
import os

app = None

def start():
    app = Flask(__name__)
    if os.environ.get('FLASK_ENV') == 'production':
        app.config.from_object(ProductionConfig)
    else:
        app.config.from_object(LocalDevelopmentConfig)
    CORS(app)
    db.init_app(app)
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    app.app_context().push()
    
    return app
    
app = start()

from application.create_data import *
from application.routes.authRoutes import *   
from application.routes.userRoutes import * 
from application.routes.adminRoutes import * 
from application.routes.profRoutes import * 

if __name__ == '__main__':
    create_initial_data(app)
    app.run()