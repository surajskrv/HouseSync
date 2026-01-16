from flask import current_app as app
from flask_security import hash_password
from .extensions import db
from .models import ServiceType as Service

def create_initial_data(app):
    with app.app_context():
        db.create_all()
    
        # 1. Create Roles
        app.security.datastore.find_or_create_role(name='admin', description='admin of housesync or Superuser')
        app.security.datastore.find_or_create_role(name='prof', description='housesync service providers')
        app.security.datastore.find_or_create_role(name='client', description='user who get the service from service providers')
        
        # 2. Create Admin User
        if not app.security.datastore.find_user(email='admin@gmail.com'):
            app.security.datastore.create_user(
                email='admin@gmail.com', 
                password=hash_password('admin123'), 
                roles=['admin']
            )
        
        # 3. Create Services
        services_data = [
            {
                "name": "Plumbing",
                "description": "Leaks, installations, repairs.",
            },
            {
                "name": "Electrical",
                "description": "Wiring, power, safety.",
            },
            {
                "name": "Cleaning",
                "description": "Deep clean & sanitization.",
            },
            {
                "name": "Carpentry",
                "description": "Furniture & woodwork.",
            },
            {
                "name": "Painting",
                "description": "Interior & exterior freshness.",
            },
            {
                "name": "AC Repair",
                "description": "Cooling system experts.",
            }
        ]

        # Iterate and add if they don't exist
        for data in services_data:
            # Check if service exists by name to avoid duplicates
            existing_service = Service.query.filter_by(name=data['name']).first()
            
            if not existing_service:
                new_service = Service(
                    name=data['name'],
                    description=data['description'],
                    base_price=500.0  # Default base price
                )
                db.session.add(new_service)
            
        # Commit all changes (roles, admin, services)

        db.session.commit()
