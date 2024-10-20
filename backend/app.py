"""
Flask Application for File Upload and Data Management.

This app handles the upload of CSV files, processes them using pandas,
and provides endpoints to manage transaction data, including adding and 
deleting individual transactions.

Modules:
- Flask
- pandas

Endpoints:
- /upload: Uploads a CSV file and processes it.
- /get_data: Returns the processed data as JSON.
- /add_transaction: Adds a new transaction to the data storage.
- /delete_transaction: Deletes a transaction from the data storage.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for the Flask app

# Temporary in-memory data storage for uploaded transactions
uploaded_data = []

@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Uploads a CSV file and processes its contents.

    This function handles file upload, validates if the file is a CSV, 
    and then converts the file data into a dictionary format using pandas. 
    The data is added to the global in-memory storage.

    Returns:
        Response (JSON): A success response containing the data or an error 
        message if any step fails.
    """
    global uploaded_data

    # Check if a file is included in the request
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file received'}), 400

    # Ensure it's a CSV file
    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'Invalid file type. Only CSV files are allowed.'}), 400

    try:
        # Process the CSV file using pandas
        df = pd.read_csv(file)
        data = df.to_dict(orient='records')

        # Append new data to the existing data structure
        uploaded_data.extend(data)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

@app.route('/get_data', methods=['GET'])
def get_data():
    """
    Retrieves all uploaded transaction data.

    This function returns the in-memory data storage that contains all 
    uploaded transaction records.

    Returns:
        Response (JSON): A success response containing all transaction data.
    """
    return jsonify(uploaded_data), 200

@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    """
    Adds a new transaction to the data storage.

    This function receives transaction data as JSON, validates the required fields,
    and converts the 'Amount' and 'Balance' to float for consistency. If validation 
    passes, the new transaction is added to the global in-memory storage.

    Returns:
        Response (JSON): A success response with the added transaction or an error 
        message if validation fails.
    """
    global uploaded_data

    new_transaction = request.json

    # Validate the new transaction data
    required_fields = ['Date', 'Description', 'Amount', 'Balance', 'Category']
    for field in required_fields:
        if field not in new_transaction:
            return jsonify({'error': f'Missing field: {field}'}), 400

    try:
        # Convert 'Amount' and 'Balance' to float for consistency
        new_transaction['Amount'] = float(new_transaction['Amount'])
        new_transaction['Balance'] = float(new_transaction['Balance'])

        # Add the new transaction to the data storage
        uploaded_data.append(new_transaction)
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
    return jsonify(deleted_transaction), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
