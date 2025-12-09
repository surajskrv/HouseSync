import os

class Config():
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
class LocalDevelopmentConfig(Config):
    # Check if running on Render (Production) or Local
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///housesync.db')
    
    # Fix for Postgres URLs on some platforms (postgres:// -> postgresql://)
    if SQLALCHEMY_DATABASE_URI and SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)

    DEBUG = True
    
    # Security configuration
    # Try to get secret keys from Environment, otherwise fallback to these defaults
    SECRET_KEY = os.environ.get('SECRET_KEY', 'housesync-secret-key') 
    SECURITY_PASSWORD = 'bcrypt' 
    SECURITY_PASSWORD_SALT = os.environ.get('SECURITY_PASSWORD_SALT', 'housesync-password-salt') 
    WTF_CSRF_ENABLED = False 
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Auth-Token'