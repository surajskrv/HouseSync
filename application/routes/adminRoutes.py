from flask import current_app as app, jsonify, request, render_template
from flask_security import login_user, hash_password, verify_password, auth_required, logout_user, roles_required, current_user
from  ..extensions import db
from ..models import Customer, Professional

datastore = app.security.datastore


# ----------------  Admin  -----------------

@app.route('/api/admin')
@auth_required('token')
@roles_required('admin')
def admin_page():
    return jsonify({
        "message": "Admin login successful"
    })
    
@app.route('/api/create_service', methods=['POST'])
@roles_required('admin')
@auth_required('token')
def create_service():
    data = request.get_json()
    service = ServiceType(
        name=data['name'],
        description=data.get('description', ''),
        base_price=data['base_price']
    )
    db.session.add(service)
    db.session.commit()
    
    log_admin_activity(current_user.id, 'create_service', service.id)
    return jsonify(service.to_dict()), 201

@app.route('/api/edit_services/<int:service_id>', methods=['PUT'])
@roles_required('admin')
@auth_required('token')
def edit_service(service_id):
    service = ServiceType.query.get_or_404(service_id)
    data = request.get_json()
    
    service.name = data.get('name', service.name)
    service.description = data.get('description', service.description)
    service.base_price = data.get('base_price', service.base_price)
    
    db.session.commit()
    log_admin_activity(current_user.id, 'update_service', service.id)
    return jsonify(service.to_dict())

# admin/professionals.py
@app.route('/professionals/<int:pro_id>/verify', methods=['POST'])
@roles_required('admin')
@auth_required('token')
def verify_professional(pro_id):
    """Verify a professional account"""
    professional = Professional.query.get_or_404(pro_id)
    professional.is_verified = True
    db.session.commit()
    
    log_admin_activity(current_user.id, 'verify_professional', pro_id)
    return jsonify({"status": "verified"})

# admin/users.py
@app.route('/users/<int:user_id>/suspend', methods=['POST'])
@roles_required('admin')
@auth_required('token')
def suspend_user(user_id):
    """Suspend a user account"""
    user = User.query.get_or_404(user_id)
    user.active = False
    db.session.commit()
    
    log_admin_activity(current_user.id, 'suspend_user', user_id)
    return jsonify({"status": "suspended"})
    

@app.route('/api/pro')
@auth_required('token')
@roles_required('pro')
def pro_page():
    user = current_user
    return jsonify({
        "username": user.name,
        "email": user.email,
        "message": "User login successful"
    })

@app.route('/api/user')
@auth_required('token')
@roles_required('user')
def user_page():
    user = current_user
    return jsonify({
        "username": user.name,
        "email": user.email,
        "message": "User login successful"
    })
