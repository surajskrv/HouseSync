from flask import current_app as app
from flask_security import hash_password
from .database import db

with app.app_context():
    db.create_all()
    
    app.security.datastore.find_or_create_role(name='admin', description = 'admin of housesync')
    app.security.datastore.find_or_create_role(name='pro', description = 'housesync service providers')
    app.security.datastore.find_or_create_role(name='user', description = 'user who get the service from service providers')
    db.session.commit()
    
    if not app.security.datastore.find_user(email= 'admin@gmail.com'):
        app.security.datastore.create_user(email = 'admin@gmail.com',name='admin', password = hash_password('hello'), roles = ['admin'])
        
    if not app.security.datastore.find_user(email= 'sam@gmail.com'):
        app.security.datastore.create_user(email = 'sam@gmail.com',name='sam', password = hash_password('hello'), roles = ['user'])
        
    if not app.security.datastore.find_user(email='pro@gmail.com'):
        app.security.datastore.create_user(email='pro@gmail.com', name='pro', password = hash_password('hello'), roles = ['pro'])
    
    db.session.commit()