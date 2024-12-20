from flask import request, jsonify, Flask
from response_system.response import ResponseGenerator
from google.api_core.exceptions import PermissionDenied
import os
import tempfile


app = Flask(__name__)
rgen = ResponseGenerator()

@app.route('/summary', methods=['GET'])
def get_summary():
    data = request.get_json()

    file_id = data.get('file_id')

    if not file_id:
        return jsonify({"error": "No selected file."}), 400
    
    try:
        summary = rgen.generate_summary(file_id)
        return jsonify({"summary": summary})
    except PermissionDenied as e:   # Raised when gemini can't find file
        return jsonify({"error": "file does not exist"}), 400

@app.route('/upload', methods = ['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part."}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file."}), 400
    
    if file:
        # Check file size
        file.seek(0, 2)         # Move cursor to end
        file_size = file.tell()     # Get current position of cursor
        MAX_SIZE = 10 * 1024 * 1024     # 10MB
        if file_size > MAX_SIZE:
            return jsonify({"error": "Selected file too large."}), 400
        
        # Uploading to gemini
        temp_file = tempfile.NamedTemporaryFile(delete=False)   # Creating temporary file
        file.save(temp_file.name)

        try:
            file_id = rgen.upload_file(temp_file.name)
            os.remove(temp_file.name)   # Removing after use
            return jsonify({"file_id": file_id})
        except Exception as e:
            os.remove(temp_file.name)   # Removing after use
            return jsonify({"error": f"Error uploading file: {e}"}), 400

@app.route('/query', methods = ['GET'])
def query():
    filename = request.form['filename']
    question = request.form['question']
    answer = rgen.get_answer(question=question, file_id=filename)
    return jsonify({"answer": answer})

@app.route('/quiz', methods = ['GET'])
def gen_quiz():
    file_id = request.form['file_id']

    if not file_id:
        return jsonify({"error":"No file selected"}), 400

    quiz = rgen.generate_quiz(file_id)
    return jsonify(quiz)

if __name__ == '__main__':
    app.run(debug=True)