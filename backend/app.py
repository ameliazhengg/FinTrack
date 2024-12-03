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
from fuzzywuzzy import fuzz, process

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

TARGET_COLUMNS = {
    'Transaction Date': 'Date',
    'Amount': 'Amount',
    'Category': 'Category',
    'Description': 'Description'
}
MATCH_THRESHOLD = 75

def fuzzy_match_columns(df):
    """
    Matches CSV columns with target columns using FuzzyWuzzy with improved scoring logic.

    Args:
        df (DataFrame): The DataFrame with the original column names.

    Returns:
        DataFrame: A DataFrame with only the matched columns, renamed to standard names.
    """
    matched_columns = {}

    # Loop through each target column and find the best match in the DataFrame's columns
    for target, standard_name in TARGET_COLUMNS.items():
        # Use multiple scoring functions to determine the best match
        choices = df.columns.tolist()

        # Extract the best match using different scoring functions
        best_match_partial = process.extractOne(target, choices, scorer=fuzz.partial_ratio)
        best_match_sort = process.extractOne(target, choices, scorer=fuzz.token_sort_ratio)
        best_match_set = process.extractOne(target, choices, scorer=fuzz.token_set_ratio)

        # Collect the matches in a list
        matches = [
            ("partial_ratio", best_match_partial),
            ("token_sort_ratio", best_match_sort),
            ("token_set_ratio", best_match_set)
        ]

        # Find the match with the highest score
        best_match = max(matches, key=lambda x: x[1][1] if x[1] else 0)

        # Debug: Print out the scoring details
        print(f"Trying to match '{target}'...")
        for name, match in matches:
            if match:
                print(f"  {name}: Best match found: '{match[0]}' with score {match[1]}")

        # Check if the best match score exceeds the threshold
        if best_match[1] and best_match[1][1] >= MATCH_THRESHOLD:
            matched_columns[best_match[1][0]] = standard_name
        else:
            print(f"Warning: Could not find a match for '{target}' with a sufficient score.")


    # Filter DataFrame to include only matched columns and rename them to the standard names
    try:
        df = df[list(matched_columns.keys())].rename(columns=matched_columns)
    except KeyError as e:
        print(f"Error: {e}. The columns available in the CSV were: {df.columns.tolist()}")
        raise e

    return df

def is_valid_transaction(transaction):
    """
    Validates a transaction record by checking required fields and data types.

    This function ensures that a transaction record contains all required 
    fields and that the 'Amount' field is numeric.

    Args:
        transaction (dict): The transaction record to validate.

    Returns:
        bool: True if the transaction is valid, False otherwise.
    """
    required_fields = ['Date', 'Description', 'Amount', 'Category']

    # Check if all required fields are present and non-null
    if not all(field in transaction and transaction[field] is not None for field in required_fields):
        return False

    # Validate the 'Date' field is in a valid format
    try:
        pd.to_datetime(transaction['Date'])
    except (ValueError, TypeError):
        return False

    # Validate the 'Amount' field is numeric
    try:
        transaction['Amount'] = float(transaction['Amount'])
    except (ValueError, TypeError):
        return False

    return True


@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Uploads a CSV file and processes its contents.

    This function handles file upload, validates if the file is a CSV,
    applies fuzzy matching to standardize columns, and checks each transaction 
    for validity before adding it to the global in-memory storage.

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

        # Apply fuzzy matching to filter and standardize column names
        df = fuzzy_match_columns(df)

        # Only keep the required columns
        df = df[['Date', 'Description', 'Amount', 'Category']]

        # Handle NaN values in the 'Category' column by replacing them with "Personal"
        df['Category'].fillna("Personal", inplace=True)

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
        print(f"Error processing file: {e}")
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
    fields, and converts the 'Amount' to float for consistency. 
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
        # Add the new transaction to the data storage and save it
        uploaded_data.append(new_transaction)
        save_data()  # Save data to the JSON file for persistence
        return jsonify(new_transaction), 200
    except ValueError:
        return jsonify({'error': 'Invalid data format. Amount should be a number.'}), 400


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
