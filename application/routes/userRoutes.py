from flask import current_app as app, jsonify, request, render_template
from flask_security import login_user, hash_password, verify_password, auth_required, logout_user, roles_required, current_user
from  ..extensions import db
from ..models import Customer, Professional

datastore = app.security.datastore
