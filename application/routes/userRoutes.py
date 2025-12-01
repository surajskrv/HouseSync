from flask import current_app as app, jsonify, request
from flask_security import auth_required, roles_required, current_user
from ..extensions import db
from ..models import Customer, ServiceRequest, ServiceType
from datetime import datetime

# ==========================================
# Profile Management
# ==========================================

@app.route('/api/user/profile', methods=['GET'])
@roles_required('client')
@auth_required('token')
def get_user_profile():
    """Get the current customer's profile details."""
    customer = current_user.customer_profile
    if not customer:
        return jsonify({"message": "Profile not found"}), 404
        
    return jsonify({
        "id": customer.user_id,
        "name": customer.name,
        "email": current_user.email,
        "phone": customer.phone,
        "address": customer.address,
        "pincode": customer.pincode
    }), 200

@app.route('/api/user/profile', methods=['PUT'])
@roles_required('client')
@auth_required('token')
def update_user_profile():
    """Update customer's profile details."""
    customer = current_user.customer_profile
    data = request.get_json()
    
    if 'name' in data:
        customer.name = data['name']
    if 'phone' in data:
        customer.phone = data['phone']
    if 'address' in data:
        customer.address = data['address']
    if 'pincode' in data:
        customer.pincode = data['pincode']

    db.session.commit()
    return jsonify({"message": "Profile updated successfully"}), 200


# ==========================================
# Service Browsing
# ==========================================

@app.route('/api/user/services', methods=['GET'])
@auth_required('token')
def get_available_services_user():
    """Fetch all available services for the user to choose from."""
    services = ServiceType.query.all()
    return jsonify([{
        'id': s.id,
        'name': s.name,
        'description': s.description,
        'base_price': s.base_price
    } for s in services]), 200


# ==========================================
# Service Request Management
# ==========================================

@app.route('/api/user/request', methods=['POST'])
@roles_required('client')
@auth_required('token')
def create_service_request():
    """Create a new service request."""
    data = request.get_json()
    
    if 'service_type_id' not in data:
        return jsonify({"message": "Service Type ID is required"}), 400

    service_type = ServiceType.query.get(data['service_type_id'])
    if not service_type:
        return jsonify({"message": "Invalid Service Type"}), 404

    # Handle date parsing (assuming 'YYYY-MM-DD' from frontend)
    request_date = datetime.now()
    if 'date_of_request' in data and data['date_of_request']:
        try:
            request_date = datetime.strptime(data['date_of_request'], '%Y-%m-%d')
        except ValueError:
            pass # Fallback to current datetime if parsing fails

    new_request = ServiceRequest(
        service_type_id=service_type.id,
        customer_id=current_user.id,
        date_of_request=request_date,
        remarks=data.get('remarks', ''),
        service_status='requested'
    )
    
    db.session.add(new_request)
    db.session.commit()
    
    return jsonify({"message": "Service requested successfully", "id": new_request.id}), 201


@app.route('/api/user/requests', methods=['GET'])
@roles_required('client')
@auth_required('token')
def get_my_requests():
    """Get all service requests made by the current user."""
    requests = ServiceRequest.query.filter_by(customer_id=current_user.id).order_by(ServiceRequest.date_of_request.desc()).all()
    
    output = []
    for req in requests:
        # Handle cases where professional is not assigned yet
        professional_name = req.professional.name if req.professional else None
        professional_phone = req.professional.phone if req.professional else None
        
        output.append({
            "id": req.id,
            "service_name": req.service_type.name,
            "base_price": req.service_type.base_price,
            "professional_name": professional_name,
            "professional_phone": professional_phone,
            "date_of_request": req.date_of_request,
            "date_of_completion": req.date_of_completion,
            "status": req.service_status,
            "remarks": req.remarks,
            "rating": req.rating
        })
        
    return jsonify(output), 200


@app.route('/api/user/request/<int:request_id>', methods=['GET'])
@roles_required('client')
@auth_required('token')
def get_request_details(request_id):
    """Get details of a specific request."""
    req = ServiceRequest.query.get_or_404(request_id)
    
    if req.customer_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403
        
    professional_data = None
    if req.professional:
        professional_data = {
            "name": req.professional.name,
            "phone": req.professional.phone,
            "id": req.professional.user_id
        }

    return jsonify({
        "id": req.id,
        "service_name": req.service_type.name,
        "description": req.service_type.description,
        "price": req.service_type.base_price,
        "status": req.service_status,
        "date_of_request": req.date_of_request,
        "remarks": req.remarks,
        "professional": professional_data,
        "rating": req.rating
    }), 200


@app.route('/api/user/request/<int:request_id>', methods=['PUT'])
@roles_required('client')
@auth_required('token')
def update_service_request(request_id):
    """Edit an existing service request (e.g., change date or remarks)."""
    req = ServiceRequest.query.get_or_404(request_id)
    
    if req.customer_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403
        
    if req.service_status in ['closed', 'completed', 'cancelled']:
        return jsonify({"message": "Cannot edit a closed or cancelled request"}), 400

    data = request.get_json()
    
    if 'remarks' in data:
        req.remarks = data['remarks']
        
    if 'date_of_request' in data:
        try:
            req.date_of_request = datetime.strptime(data['date_of_request'], '%Y-%m-%d')
        except ValueError:
            pass 

    db.session.commit()
    return jsonify({"message": "Request updated successfully"}), 200


@app.route('/api/user/request/<int:request_id>/close', methods=['POST'])
@roles_required('client')
@auth_required('token')
def close_service_request(request_id):
    """
    Close a service request (mark as completed by user) and provide feedback/rating.
    """
    req = ServiceRequest.query.get_or_404(request_id)
    
    if req.customer_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403
    
    # Allows closing if it was assigned or pending closing
    if req.service_status == 'cancelled':
         return jsonify({"message": "Cannot close a cancelled request"}), 400
         
    data = request.get_json()
    
    req.service_status = 'completed' 
    req.date_of_completion = datetime.now()
    
    if 'rating' in data:
        req.rating = int(data['rating'])
    
    # Optionally update remarks with final review
    if 'remarks' in data:
        req.remarks = data['remarks'] 

    db.session.commit()
    return jsonify({"message": "Service closed and rated successfully"}), 200


@app.route('/api/user/request/<int:request_id>/cancel', methods=['POST'])
@roles_required('client')
@auth_required('token')
def cancel_service_request(request_id):
    """Cancel a pending service request."""
    req = ServiceRequest.query.get_or_404(request_id)
    
    if req.customer_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403
        
    if req.service_status in ['closed', 'completed']:
        return jsonify({"message": "Cannot cancel a completed service"}), 400

    req.service_status = 'cancelled'
    req.professional_id = None # Unassign if assigned
    db.session.commit()
    
    return jsonify({"message": "Request cancelled successfully"}), 200