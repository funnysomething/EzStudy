from flask import Flask, request
from flask_cors import CORS, cross_origin
from pptx import Presentation
from io import BytesIO
from utils.parse import extract_text_from_pptx 

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/register')
@cross_origin()
def home():
    return "Hello, Flask!"


@app.route("/api/upload", methods = ['POST'])
def upload_file():
    # Get uploaded file
    uploaded_file = request.json

    print(uploaded_file)
    # #Load the PPTX presentation
    # prs = Presentation(uploaded_file)

    # # Extract text from inputted presentation
    # text = extract_text_from_pptx(prs)

    # return (text.split())[0]
    return "Hello"

if __name__ == '__main__':
    app.run(debug=True)