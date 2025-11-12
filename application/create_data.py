from flask import current_app as app
from flask_security import hash_password
from .extensions import db

with app.app_context():
    db.create_all()
    
    app.security.datastore.find_or_create_role(name='admin', description = 'admin of housesync or Superuser')
    app.security.datastore.find_or_create_role(name='prof', description = 'housesync service providers')
    app.security.datastore.find_or_create_role(name='client', description = 'user who get the service from service providers')
    db.session.commit()
    
    if not app.security.datastore.find_user(email= 'admin@gmail.com'):
        app.security.datastore.create_user(email = 'admin@gmail.com', password = hash_password('helloworld'), roles = ['admin'])
    
    db.session.commit()