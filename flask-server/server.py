from flask import Flask, request
from flask_cors import CORS
from pptx import Presentation
from utils.parse import extract_text_from_pptx 
from utils.gptsummarizer import generate_summary

app = Flask(__name__)

CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/register')
def home():
    return "Hello, Flask!"


@app.route("/api/upload", methods = ['POST'])
async def upload_file():
    print("Posted file: {}".format(request.files['file']))
    file = request.files['file']

    prs = Presentation(file)

    text = extract_text_from_pptx(prs)

    response = await generate_summary(text)

    print(response)

    return response

if __name__ == '__main__':
    app.run(debug=True)