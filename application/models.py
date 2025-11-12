from .extensions import db
from flask_security import UserMixin, RoleMixin
from datetime import datetime

associate_table = db.Table(
    'user_roles',
    db.Column('id', db.Integer, primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), nullable=False),
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'), nullable=False)
)

class Role(db.Model, RoleMixin):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    active = db.Column(db.Boolean, default=True, nullable=False)
    roles = db.relationship('Role', secondary=associate_table, backref=db.backref('users', lazy='dynamic'))
    customer_profile = db.relationship('Customer', back_populates='user', uselist=False)
    professional_profile = db.relationship('Professional', back_populates='user', uselist=False)

class Customer(db.Model):
    __tablename__ = 'customers'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(512), nullable=False)
    pincode = db.Column(db.String(20), nullable=False)
    service_requests = db.relationship('ServiceRequest', back_populates='customer', lazy=True)
    user = db.relationship('User', back_populates='customer_profile')

class Professional(db.Model):
    __tablename__ = 'professionals'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    experience = db.Column(db.Integer, nullable=False)
    service_type = db.Column(db.String(255), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    service_requests = db.relationship('ServiceRequest', back_populates='professional', lazy=True)
    user = db.relationship('User', back_populates='professional_profile')

class ServiceType(db.Model):
    __tablename__ = 'service_types'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(1024), nullable=True)
    base_price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

class ServiceRequest(db.Model):
    __tablename__ = 'service_requests'
    id = db.Column(db.Integer, primary_key=True)
    service_type_id = db.Column(db.Integer, db.ForeignKey('service_types.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.user_id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('professionals.user_id'), nullable=True)
    date_of_request = db.Column(db.DateTime, default=datetime.now)
    date_of_completion = db.Column(db.DateTime, nullable=True)
    service_status = db.Column(db.String(50), default='requested')
    remarks = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Integer, nullable=True)
    service_type = db.relationship('ServiceType')
    customer = db.relationship('Customer', back_populates='service_requests')
    professional = db.relationship('Professional', back_populates='service_requests')
