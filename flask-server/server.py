from flask import Flask, request
from flask_cors import CORS, cross_origin
from pptx import Presentation
from io import BytesIO
from utils.parse import extract_text_from_pptx 
from utils.gptsummarizer import generate_summary

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/register')
@cross_origin()
def home():
    return "Hello, Flask!"


@app.route("/api/upload", methods = ['POST'])
def upload_file():
    if 'files' not in request.files:
        return 'No files uploaded', 400
    
    uploaded_files = request.files.getlist('files')

    # Load the PPTX presentation
    prs = Presentation(uploaded_files[0])

    # Extract text from inputted presentation
    text = extract_text_from_pptx(prs)

    response = generate_summary(text)

    return response

if __name__ == '__main__':
    app.run(debug=True)