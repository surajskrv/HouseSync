from flask import current_app as app, jsonify, request
from flask_security import auth_required, roles_required, current_user
from ..extensions import db
from ..models import ServiceRequest, Professional, ServiceType, Customer
from datetime import datetime

# ==========================================
# Profile Management
# ==========================================

@app.route('/api/prof/profile', methods=['GET'])
@roles_required('prof')
@auth_required('token')
def get_prof_profile():
    """Get the current professional's profile details."""
    prof = current_user.professional_profile
    if not prof:
        return jsonify({"message": "Profile not found"}), 404
        
    return jsonify({
        "id": prof.user_id,
        "name": prof.name,
        "email": current_user.email,
        "phone": prof.phone,
        "service_type": prof.service_type,
        "experience": prof.experience,
        "is_verified": prof.is_verified
    }), 200

@app.route('/api/prof/profile', methods=['PUT'])
@roles_required('prof')
@auth_required('token')
def update_prof_profile():
    """Update professional's profile details."""
    prof = current_user.professional_profile
    data = request.get_json()
    
    if 'name' in data:
        prof.name = data['name']
    if 'phone' in data:
        prof.phone = data['phone']
    if 'experience' in data:
        prof.experience = data['experience']
    
    # Service type usually requires admin approval to change, 
    # but if allowed:
    # if 'service_type' in data:
    #     prof.service_type = data['service_type']

    db.session.commit()
    return jsonify({"message": "Profile updated successfully"}), 200


# ==========================================
# Service Request Management
# ==========================================

@app.route('/api/prof/available_requests', methods=['GET'])
@roles_required('prof')
@auth_required('token')
def get_available_requests():
    """
    Get all pending service requests that match the professional's service type.
    Professionals should only see jobs relevant to their skill (e.g. Plumber sees Plumbing jobs).
    """
    prof = current_user.professional_profile
    if not prof.is_verified:
        return jsonify({"message": "Account not verified by Admin yet", "requests": []}), 403

    # Find the ServiceType ID matching the professional's string service_type
    # Assuming the professional's 'service_type' string matches a ServiceType.name
    service_type_obj = ServiceType.query.filter_by(name=prof.service_type).first()
    
    if not service_type_obj:
        return jsonify([]), 200

    # Fetch requests: status is 'requested' AND matches the service type
    requests = ServiceRequest.query.filter_by(
        service_status='requested',
        service_type_id=service_type_obj.id
    ).all()
    
    output = []
    for req in requests:
        output.append({
            "id": req.id,
            "service_name": req.service_type.name,
            "customer_name": req.customer.name,
            "address": req.customer.address,
            "pincode": req.customer.pincode,
            "date_of_request": req.date_of_request,
            "remarks": req.remarks
        })
        
    return jsonify(output), 200


@app.route('/api/prof/request/<int:request_id>/accept', methods=['POST'])
@roles_required('prof')
@auth_required('token')
def accept_request(request_id):
    """Accept a service request."""
    prof = current_user.professional_profile
    if not prof.is_verified:
        return jsonify({"message": "Account not verified"}), 403

    req = ServiceRequest.query.get_or_404(request_id)
    
    if req.service_status != 'requested':
        return jsonify({"message": "Request is no longer available"}), 400
    
    # Verify skill match
    if req.service_type.name != prof.service_type:
        return jsonify({"message": "Service type mismatch"}), 400

    req.professional_id = prof.user_id
    req.service_status = 'assigned'
    db.session.commit()
    
    return jsonify({"message": "Request accepted successfully"}), 200


@app.route('/api/prof/request/<int:request_id>/reject', methods=['POST'])
@roles_required('prof')
@auth_required('token')
def reject_request(request_id):
    """
    Reject an *assigned* request (if professional needs to cancel).
    This sets the status back to 'requested' so other professionals can pick it up.
    """
    req = ServiceRequest.query.get_or_404(request_id)
    
    # Ensure this professional actually owns the job
    if req.professional_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403
        
    if req.service_status != 'assigned':
        return jsonify({"message": "Cannot reject closed or pending requests"}), 400

    req.professional_id = None
    req.service_status = 'requested'
    db.session.commit()
    
    return jsonify({"message": "Job rejected/cancelled successfully"}), 200


@app.route('/api/prof/my_jobs', methods=['GET'])
@roles_required('prof')
@auth_required('token')
def get_my_jobs():
    """Get all jobs currently assigned to or completed by this professional."""
    prof_id = current_user.id
    
    # Fetch assigned or closed jobs
    jobs = ServiceRequest.query.filter(
        ServiceRequest.professional_id == prof_id
    ).order_by(ServiceRequest.date_of_request.desc()).all()
    
    output = []
    for job in jobs:
        output.append({
            "id": job.id,
            "service_name": job.service_type.name,
            "customer_name": job.customer.name,
            "customer_phone": job.customer.phone,
            "address": job.customer.address,
            "pincode": job.customer.pincode,
            "status": job.service_status,
            "date_of_request": job.date_of_request,
            "date_of_completion": job.date_of_completion,
            "rating": job.rating,
            "remarks": job.remarks
        })
        
    return jsonify(output), 200


@app.route('/api/prof/job/<int:request_id>/close', methods=['POST'])
@roles_required('prof')
@auth_required('token')
def close_job(request_id):
    """Mark a job as completed."""
    req = ServiceRequest.query.get_or_404(request_id)
    
    if req.professional_id != current_user.id:
        return jsonify({"message": "Unauthorized"}), 403
        
    if req.service_status != 'assigned':
        return jsonify({"message": "Job is not in progress"}), 400

    req.service_status = 'closed'
    req.date_of_completion = datetime.now()
    db.session.commit()
    
    return jsonify({"message": "Job marked as completed"}), 200