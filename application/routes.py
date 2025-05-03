from flask import current_app as app, jsonify, request, render_template
from flask_security import login_user, hash_password, verify_password, auth_required, logout_user, roles_required, current_user
from  .database import db
from .models import Customer, Professional

datastore = app.security.datastore

@app.route('/', methods = ['GET'])
def home():
    return render_template('index.html')

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400
        
        user = app.security.datastore.find_user(email=email)
        if not user:
            return jsonify({"message": "User not found"}), 404
        if not verify_password(password, user.password):
            return jsonify({"message": "Invalid credentials"}), 401
        
        login_user(user)
        user_role = user.roles[0].name
        return jsonify({
            "message": "Login successful",
            "auth_token": user.get_auth_token(),
            "user_id": user.id,
            "user_role": user_role,
        }), 200
        
    except Exception as e:
        return jsonify({"message": "Problem in Login"}, e), 500

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "Error in data!"}), 400

        required_fields = ['email', 'password', 'password2', 'name']
        if not all(field in data for field in required_fields):
            return jsonify({"message": "Missing required fields!"}), 400

        email = data['email']
        password = data['password']
        password2 = data['password2']
        name = data['name']

        if password != password2:
            return jsonify({"message": "Passwords don't match"}), 400

        if len(password) <= 5:
            return jsonify({"message": "Password must be at least 5 characters"}), 400

        if app.security.datastore.find_user(email=email):
            return jsonify({"message": "Email already registered"}), 409

        if all(field in data for field in ['phone', 'address']):
            user = app.security.datastore.create_user(
                email=email,
                password=hash_password(password),
                name=name,
                roles=['user']
            )
            db.session.add(user)
            db.session.flush() 

            customer = Customer(
                user_id=user.id,
                phone=data['phone'],
                address=data['address']
            )
            db.session.add(customer)
            db.session.commit()

            return jsonify({
                "message": "Customer registered successfully",
                "user_id": user.id,
                "auth_token": user.get_auth_token()
            }), 201

        elif all(field in data for field in ['experience', 'service_type']):
            user = app.security.datastore.create_user(
                email=email,
                password=hash_password(password),
                name=name,
                roles=['pro']
            )
            db.session.add(user)
            db.session.flush()

            professional = Professional(
                user_id=user.id,
                experience=data['experience'],
                service_type=data['service_type'],
                is_verified=False
            )
            db.session.add(professional)
            db.session.commit()

            return jsonify({
                "message": "Professional registered successfully",
                "user_id": user.id,
                "auth_token": user.get_auth_token()
            }), 201

        else:
            return jsonify({
                "message": "Missing data"
            }), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error during registration"}), 500
    
@app.route('/api/logout', methods=['POST'])
@auth_required('token')
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

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
