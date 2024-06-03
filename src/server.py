from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # This line enables CORS for all routes and origins

# Пример данных, которые сервер будет возвращать
data = [
    {"number": '622'},
    {"number": "622a"},
]

@app.route('/', methods=['GET'])
def get_data():
    response = jsonify(data)
    return response

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8091)
