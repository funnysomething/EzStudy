from flask import Flask, request
from flask_cors import CORS
from utils.parse import parse_text
from utils.gptsummarizer import generate_summary

app = Flask(__name__)

CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/register')
def home():
    return "Hello, Flask!"


@app.route("/api/upload", methods = ['POST'])
async def upload_file():
    file = request.files['file']

    text = parse_text(file)

    if len(text) == 0:
        return "Invalid file type", 401

    response = await generate_summary(text)

    print("Returning generated response")

    return response

if __name__ == '__main__':
    app.run(debug=True)