class Config():
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    
class LocalDevelopmentConfig(Config):
    # Configuration for local development
    SQLALCHEMY_DATABASE_URI = 'sqlite:///housesync.db'
    DEBUG = True
    
    # Security configuration
    SECRET_KEY = 'housesync-secret-key' # hash user credentials in session
    SECURITY_PASSWORD = 'bcrypt' # Mechanism for password hashing
    SECURITY_PASSWORD_SALT = 'housesync-password-salt' # help in password hashing
    WTF_CSRF_ENABLED = False # Disable CSRF protection for testing
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Auth-Token' # Use token authentication