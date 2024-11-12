from database import db
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

class User(db.Model):
    """User model representing a registered user in the application.

    Attributes:
        id (UUID): Primary key, unique identifier for the user.
        username (str): Unique username chosen by the user.
        email (str): Unique email address for the user.
        password_hash (str): Hashed password for authentication.
        first_name (str): First name of the user.
        last_name (str): Last name of the user.
        age (int): Age of the user.
        created_at (datetime): Timestamp for when the user was created.
        updated_at (datetime): Timestamp for the last update to the user.

    Relationships:
        transactions: One-to-many relationship with Txn.
        budgets: One-to-many relationship with Budget.
        notifications: One-to-many relationship with Notification.
        settings: One-to-one relationship with Setting.
    """
    __tablename__ = 'user'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password_hash = db.Column(db.String, nullable=False)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    age = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    transactions = db.relationship('Txn', backref='user', lazy=True)
    budgets = db.relationship('Budget', backref='user', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)
    settings = db.relationship('Setting', backref='user', uselist=False)


class Txn(db.Model):
    """Transaction model representing a financial transaction by a user.

    Attributes:
        id (UUID): Primary key, unique identifier for the transaction.
        user_id (UUID): Foreign key referencing the User who made the transaction.
        date (date): Date of the transaction.
        description (str): Description of the transaction.
        amount (decimal): Amount of money involved in the transaction.
        category (str): Category of the transaction.
        created_at (datetime): Timestamp for when the transaction was created.
        updated_at (datetime): Timestamp for the last update to the transaction.
    
    Relationships:
        user: Many-to-one relationship with User. Each transaction is linked to a single user.
    """
    __tablename__ = 'txn'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date)
    description = db.Column(db.Text)
    amount = db.Column(db.Numeric)
    category = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Budget(db.Model):
    """Budget model representing a financial budget for a user.

    Attributes:
        id (UUID): Primary key, unique identifier for the budget.
        user_id (UUID): Foreign key referencing the User to whom the budget belongs.
        category (str): Category of expenses this budget applies to.
        limit (decimal): Spending limit for the category.
        current_spending (decimal): Current spending amount tracked within this budget.
        reset_interval (str): Reset interval for the budget (e.g., monthly).
        created_at (datetime): Timestamp for when the budget was created.
        updated_at (datetime): Timestamp for the last update to the budget.
    
    Relationships:
        user: Many-to-one relationship with User. Each budget entry belongs to one user.
    """
    __tablename__ = 'budget'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String)
    limit = db.Column(db.Numeric)
    current_spending = db.Column(db.Numeric, default=0)
    reset_interval = db.Column(db.String)  # e.g., "monthly", "yearly"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Setting(db.Model):
    """Setting model representing user-specific settings for the application.

    Attributes:
        id (UUID): Primary key, unique identifier for the setting.
        user_id (UUID): Foreign key referencing the User to whom the settings belong.
        currency (str): Preferred currency for the user.
        language (str): Preferred language for the user.
        dark_mode (bool): Whether the user prefers dark mode.
        created_at (datetime): Timestamp for when the settings were created.
        updated_at (datetime): Timestamp for the last update to the settings.
    
    Relationships:
        user: One-to-one relationship with User. Each user has a unique set of settings.
    """
    __tablename__ = 'setting'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    currency = db.Column(db.String)
    language = db.Column(db.String)
    dark_mode = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Notification(db.Model):
    """Notification model representing notifications for a user.

    Attributes:
        id (UUID): Primary key, unique identifier for the notification.
        user_id (UUID): Foreign key referencing the User to whom the notification belongs.
        message (str): Notification message content.
        is_read (bool): Whether the notification has been read.
        created_at (datetime): Timestamp for when the notification was created.
    
    Relationships:
        user: Many-to-one relationship with User. Each notification is associated with a single user.
    """
    __tablename__ = 'notification'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.Text)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
