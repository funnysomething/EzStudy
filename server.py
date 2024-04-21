from flask import Flask, request, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS #Comment on deployment

from utils.parse import parse_text
from utils.gptsummarizer import generate_summary

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
CORS(app) #Comment on deployment
api = Api(app)

@app.route("/", defaults={'path':''})
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/api/upload", methods = ['POST'])
async def upload_file():
    file = request.files['file']
    text = parse_text(file)
    if len(text) == 0:
        return "Invalid file type", 401
    response = await generate_summary(text)
    return response

if __name__ == '__main__':
    app.run(debug=True)