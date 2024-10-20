from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for the Flask app

# Temporary in-memory data storage
uploaded_data = []

@app.route('/upload', methods=['POST'])
def upload_file():
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
    return jsonify(uploaded_data), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
