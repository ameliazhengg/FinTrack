"""
Flask Application for File Upload and Data Management.

This app handles the upload of CSV files, processes them using pandas,
and provides an endpoint to retrieve the uploaded data.

Modules:
- Flask
- pandas

Endpoints:
- /upload: Uploads a CSV file and processes it.
- /get_data: Returns the processed data as JSON.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory data storage for uploaded CSV data
uploaded_data = []

@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Handles CSV file uploads.

    Returns:
        Response: JSON response with uploaded data or error message.
    """
    global uploaded_data

    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file received'}), 400

    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'Invalid file type. Only CSV files are allowed.'}), 400

    try:
        # Read and process CSV file
        df = pd.read_csv(file)
        data = df.to_dict(orient='records')

        uploaded_data.extend(data)  # Update in-memory data
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

@app.route('/get_data', methods=['GET'])
def get_data():
    """
    Returns the uploaded data.

    Returns:
        Response: JSON response with the data.
    """
    return jsonify(uploaded_data), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
