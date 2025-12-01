from flask import current_app as app, jsonify, request
from flask_security import auth_required, roles_required, current_user
from ..extensions import db
from ..models import User, Professional, Customer, ServiceType, ServiceRequest
from sqlalchemy import func

# ... (Previous Service Management Routes: get_services, create_service, etc.) ...
# ... (Previous User Management Routes: get_all_users, toggle_user_status, etc.) ...

# ==========================================
# Service Management Routes
# ==========================================

@app.route('/api/services', methods=['GET'])
@auth_required('token')
def get_services():
    """Fetch all available services."""
    services = ServiceType.query.all()
    return jsonify([{
        'id': s.id,
        'name': s.name,
        'description': s.description,
        'base_price': s.base_price,
        'created_at': s.created_at
    } for s in services]), 200

@app.route('/api/services', methods=['POST'])
@roles_required('admin')
@auth_required('token')
def create_service():
    """Create a new service."""
    data = request.get_json()
    if not data or 'name' not in data or 'base_price' not in data:
        return jsonify({"message": "Name and Base Price are required"}), 400
    
    # Check for duplicate
    existing = ServiceType.query.filter_by(name=data['name']).first()
    if existing:
        return jsonify({"message": f"Service '{data['name']}' already exists"}), 409

    service = ServiceType(
        name=data['name'],
        description=data.get('description', ''),
        base_price=float(data['base_price'])
    )
    db.session.add(service)
    db.session.commit()
    return jsonify({"message": "Service created successfully", "id": service.id}), 201

@app.route('/api/services/<int:service_id>', methods=['PUT'])
@roles_required('admin')
@auth_required('token')
def update_service(service_id):
    """Update an existing service."""
    service = ServiceType.query.get_or_404(service_id)
    data = request.get_json()
    
    if 'name' in data:
        service.name = data['name']
    if 'description' in data:
        service.description = data['description']
    if 'base_price' in data:
        service.base_price = float(data['base_price'])
    
    db.session.commit()
    return jsonify({"message": "Service updated successfully"}), 200

@app.route('/api/services/<int:service_id>', methods=['DELETE'])
@roles_required('admin')
@auth_required('token')
def delete_service(service_id):
    """Delete a service."""
    service = ServiceType.query.get_or_404(service_id)
    db.session.delete(service)
    db.session.commit()
    return jsonify({"message": "Service deleted successfully"}), 200


# ==========================================
# User & Professional Management Routes
# ==========================================

@app.route('/api/admin/users', methods=['GET'])
@roles_required('admin')
@auth_required('token')
def get_all_users():
    """Fetch all users (Professionals and Customers) for the Admin Dashboard."""
    users = User.query.all()
    users_data = []

    for user in users:
        # Skip Admin in the list
        if user.has_role('admin'):
            continue

        role = user.roles[0].name if user.roles else 'unknown'
        user_info = {
            'id': user.id,
            'email': user.email,
            'active': user.active, # Active status (Blocked/Unblocked)
            'role': role,
        }

        # Append role-specific details
        if role == 'prof' and user.professional_profile:
            user_info.update({
                'name': user.professional_profile.name,
                'service_type': user.professional_profile.service_type,
                'experience': user.professional_profile.experience,
                'phone': user.professional_profile.phone,
                'status': 'Approved' if user.professional_profile.is_verified else 'Pending'
            })
        elif role == 'client' and user.customer_profile:
            user_info.update({
                'name': user.customer_profile.name,
                'address': user.customer_profile.address,
                'status': 'Active' if user.active else 'Blocked'
            })
        
        users_data.append(user_info)

    return jsonify(users_data), 200

@app.route('/api/admin/user/<int:user_id>/toggle_status', methods=['POST'])
@roles_required('admin')
@auth_required('token')
def toggle_user_status(user_id):
    """Block or Unblock a user account."""
    user = User.query.get_or_404(user_id)
    
    # Prevent blocking admin
    if user.has_role('admin'):
        return jsonify({"message": "Cannot block admin"}), 403

    user.active = not user.active
    db.session.commit()
    
    status = "activated" if user.active else "blocked"
    return jsonify({"message": f"User {status} successfully", "active": user.active}), 200

@app.route('/api/admin/professional/<int:user_id>/verify', methods=['POST'])
@roles_required('admin')
@auth_required('token')
def verify_professional(user_id):
    """Approve a Professional's account."""
    prof = Professional.query.get_or_404(user_id)
    prof.is_verified = True
    db.session.commit()
    return jsonify({"message": "Professional approved successfully"}), 200

@app.route('/api/admin/professional/<int:user_id>/reject', methods=['POST'])
@roles_required('admin')
@auth_required('token')
def reject_professional(user_id):
    """Reject and delete a Professional's account."""
    user = User.query.get_or_404(user_id)
    
    if not user.has_role('prof'):
        return jsonify({"message": "User is not a professional"}), 400

    # Delete the profile and user
    if user.professional_profile:
        db.session.delete(user.professional_profile)
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({"message": "Professional request rejected and deleted"}), 200


# ==========================================
# Summary / Statistics & Analytics
# ==========================================

@app.route('/api/admin/summary', methods=['GET'])
@roles_required('admin')
@auth_required('token')
def admin_summary():
    """Get counts for dashboard summary cards."""
    # Count professionals
    prof_role = db.session.execute(
        db.select(User).filter(User.roles.any(name='prof'))
    ).scalars().all()
    
    # Count customers
    client_role = db.session.execute(
        db.select(User).filter(User.roles.any(name='client'))
    ).scalars().all()

    return jsonify({
        'services': ServiceType.query.count(),
        'professionals': len(prof_role),
        'customers': len(client_role),
        'requests': ServiceRequest.query.count()
    }), 200

@app.route('/api/admin/stats', methods=['GET'])
@roles_required('admin')
@auth_required('token')
def admin_stats():
    """Get detailed statistics for charts."""
    
    # 1. Service Request Status Distribution (Bar Chart Data)
    # Group by status and count
    status_counts = db.session.query(
        ServiceRequest.service_status, 
        func.count(ServiceRequest.id)
    ).group_by(ServiceRequest.service_status).all()
    
    status_data = {
        'labels': [],
        'data': []
    }
    for status, count in status_counts:
        status_data['labels'].append(status.capitalize())
        status_data['data'].append(count)

    # 2. Service Type Popularity & Revenue (Pie/Doughnut Chart Data)
    # Join Request with ServiceType, group by Name
    # Calculate Count and Estimated Revenue
    service_stats = db.session.query(
        ServiceType.name,
        func.count(ServiceRequest.id),
        func.sum(ServiceType.base_price)
    ).join(ServiceRequest, ServiceRequest.service_type_id == ServiceType.id)\
     .group_by(ServiceType.name).all()
     
    service_distribution = {
        'labels': [],
        'counts': [],
        'revenue': []
    }
    
    for name, count, revenue in service_stats:
        service_distribution['labels'].append(name)
        service_distribution['counts'].append(count)
        service_distribution['revenue'].append(revenue if revenue else 0)

    return jsonify({
        'request_status': status_data,
        'service_performance': service_distribution
    }), 200