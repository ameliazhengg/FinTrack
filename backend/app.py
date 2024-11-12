"""
Flask Application for File Upload and Data Management.

This app handles the upload of CSV files, processes them using pandas,
and provides endpoints to manage transaction data, including adding and 
deleting individual transactions. It also includes column standardization 
to handle variations in column names during CSV uploads.

Modules:
- Flask
- pandas
- json

Endpoints:
- /upload: Uploads a CSV file and processes it.
- /get_data: Returns the processed data as JSON.
- /add_transaction: Adds a new transaction to the data storage.
- /delete_transaction: Deletes a transaction from the data storage.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json
import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
from database import db, migrate
from models import User, Txn, Budget, Setting, Notification

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Enable CORS for the Flask app

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize db and migrate
db.init_app(app)
migrate.init_app(app, db)

# Define DATA_FILE and load data if it exists
DATA_FILE = 'transactions.json'
if os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'r') as file:
        uploaded_data = json.load(file)
else:
    uploaded_data = []  # Temporary in-memory data storage for uploaded transactions

# Define possible column name variations
COLUMN_MAP = {
    'Date': ['date', 'DATE', 'trans. date', 'trans date', 'post date', 'posting date'],
    'Description': ['description', 'desc', 'DESCRIPTION', 'desc.'],
    'Amount': ['amount', 'amt', 'AMOUNT'],
    'Balance': ['balance', 'BALANCE', 'bal'],
    'Category': ['category', 'categories', 'CATEGORY']
}

def save_data():
    """
    Saves the uploaded transaction data to a JSON file for persistence.

    This function saves the current state of the global 'uploaded_data'
    list to a JSON file, ensuring data is not lost between sessions.

    Args:
        None

    Returns:
        None
    """
    with open(DATA_FILE, 'w') as file:
        json.dump(uploaded_data, file)

def standardize_columns(df):
    """
    Standardizes column names in the DataFrame based on predefined variations.

    This function renames columns in the given DataFrame to match the 
    expected format by mapping variations of column names to standard 
    column names.

    Args:
        df (DataFrame): The DataFrame with original column names.

    Returns:
        DataFrame: DataFrame with standardized column names.
    """
    new_columns = {}
    found_columns = []

    # Iterate through the original DataFrame columns
    for col in df.columns:
        col_lower = col.lower()
        matched = False
        
        # Check if the column matches any variation in COLUMN_MAP
        for standard_col, variations in COLUMN_MAP.items():
            if col_lower in [v.lower() for v in variations]:
                new_columns[col] = standard_col
                found_columns.append(standard_col)
                matched = True
                break
        
        # If no match found, keep the original column name
        if not matched:
            new_columns[col] = col

    # Debugging: Print the mapping results
    print(f"Original Columns: {df.columns.tolist()}")
    print(f"Mapped Columns: {new_columns}")
    
    # Rename columns in the DataFrame
    df = df.rename(columns=new_columns)

    # Check if all required columns are present after mapping
    required_columns = set(COLUMN_MAP.keys())
    if not required_columns.issubset(found_columns):
        print(f"Missing Required Columns: {required_columns - set(found_columns)}")

    return df

def is_valid_transaction(transaction):
    """
    Validates a transaction record by checking required fields and data types.

    This function ensures that a transaction record contains all required 
    fields and that the 'Amount' and 'Balance' fields are numeric.

    Args:
        transaction (dict): The transaction record to validate.

    Returns:
        bool: True if the transaction is valid, False otherwise.
    """
    required_fields = ['Date', 'Description', 'Amount', 'Balance', 'Category']

    # Check if all required fields are present
    if not all(field in transaction for field in required_fields):
        return False

    # Validate the 'Amount' and 'Balance' fields are numeric
    try:
        float(transaction['Amount'])
        float(transaction['Balance'])
    except ValueError:
        return False

    return True

@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Uploads a CSV file and processes its contents.

    This function handles file upload, validates if the file is a CSV,
    standardizes column names, and checks each transaction for validity 
    before adding it to the global in-memory storage.

    Returns:
        Response (JSON): A success response containing the valid data or an
        error message if any step fails.
    """
    global uploaded_data

    # Check if a file is included in the request
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file received'}), 400

    # Ensure it's a CSV file
    if not file.filename.lower().endswith('.csv'):
        return jsonify({'error': 'Invalid file type. Only CSV files are allowed.'}), 400

    try:
        # Process the CSV file using pandas
        df = pd.read_csv(file)

        # Standardize column names
        df = standardize_columns(df)

        # Convert DataFrame to a list of dictionaries
        data = df.to_dict(orient='records')
        # Validate each transaction in the CSV data
        valid_data = [record for record in data if is_valid_transaction(record)]

        if not valid_data:
            return jsonify({'error': 'No valid transactions found in the file. Please check column mapping and format.'}), 400

        # Append valid data to the existing data structure and save to file
        uploaded_data.extend(valid_data)
        save_data()
        return jsonify(valid_data), 200
    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

@app.route('/get_data', methods=['GET'])
def get_data():
    """
    Retrieves all uploaded transaction data.

    This function returns the in-memory data storage that contains all 
    uploaded transaction records.

    Args:
        None

    Returns:
        Response (JSON): A success response containing all transaction data.
    """
    return jsonify(uploaded_data), 200

@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    """
    Adds a new transaction to the data storage.

    This function receives transaction data as JSON, validates the required 
    fields, and converts the 'Amount' and 'Balance' to float for consistency. 
    If validation passes, the new transaction is added to the global in-memory 
    storage and saved to the file.

    Returns:
        Response (JSON): A success response with the added transaction or an error 
        message if validation fails.
    """
    global uploaded_data

    new_transaction = request.json

    # Validate the new transaction data
    if not is_valid_transaction(new_transaction):
        return jsonify({'error': 'Invalid transaction data'}), 400

    try:
        # Convert 'Amount' and 'Balance' to float for consistency
        new_transaction['Amount'] = float(new_transaction['Amount'])
        new_transaction['Balance'] = float(new_transaction['Balance'])

        # Add the new transaction to the data storage and save it
        uploaded_data.append(new_transaction)
        save_data()  # Save data to the JSON file for persistence
        return jsonify(new_transaction), 200
    except ValueError:
        return jsonify({'error': 'Invalid data format. Amount and Balance should be numbers.'}), 400

@app.route('/delete_transaction', methods=['DELETE'])
def delete_transaction():
    """
    Deletes a transaction from the data storage based on index.

    This function receives the index of the transaction to be deleted as a 
    query parameter, validates the index, and then removes the corresponding 
    transaction from the global in-memory storage.

    Returns:
        Response (JSON): A success response with the deleted transaction or 
        an error message if validation fails.
    """
    global uploaded_data

    transaction_index = request.args.get('index', type=int)

    # Validate the transaction index
    if transaction_index is None or transaction_index < 0 or transaction_index >= len(uploaded_data):
        return jsonify({'error': 'Invalid transaction index'}), 400

    # Remove the transaction from the data storage
    deleted_transaction = uploaded_data.pop(transaction_index)
    save_data()  # Save data to the JSON file for persistence
    return jsonify(deleted_transaction), 200

if __name__ == '__main__':
    app.run(debug=True, port=5005)
