import os

class Config():
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
class ProductionConfig(Config):
    # 1. Fetch the DB URL from the Environment Variables
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    
    # 2. Postgres URLs (Neon/Render use postgres://, SQLAlchemy requires postgresql://)
    if SQLALCHEMY_DATABASE_URI and SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)

    # 3. Security configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') 
    SECURITY_PASSWORD_SALT = os.environ.get('SECURITY_PASSWORD_SALT') 
    
    # 4. CRITICAL: Setting this to False for API-based apps (Vue.js) to avoid login errors
    WTF_CSRF_ENABLED = False 
    
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Auth-Token'
    
class LocalDevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///housesync.db')
    
    DEBUG = True
    
    SECRET_KEY = os.environ.get('SECRET_KEY', 'housesync-secret-key') 
    SECURITY_PASSWORD = 'bcrypt' 
    SECURITY_PASSWORD_SALT = os.environ.get('SECURITY_PASSWORD_SALT', 'housesync-password-salt') 
    WTF_CSRF_ENABLED = False 
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Auth-Token'