from flask import Flask, request, jsonify
import requests
import psycopg2

app = Flask(__name__)

OLLAMA_URL = "http://ollama:11434/api/generate"

DB_CONFIG = {
    "host": "database",
    "database": "aidatabase",
    "user": "aiuser",
    "password": "aipassword"
}


def save_message(question, answer, model):
    connection = psycopg2.connect(**DB_CONFIG)
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            id SERIAL PRIMARY KEY,
            question TEXT,
            answer TEXT,
            model TEXT
        )
    """)

    cursor.execute(
        "INSERT INTO conversations (question, answer, model) VALUES (%s, %s, %s)",
        (question, answer, model)
    )

    connection.commit()
    cursor.close()
    connection.close()


@app.route("/ask", methods=["POST"])
def ask_ai():

    question = request.json["question"]
    model = request.json["model"]

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": model,
            "prompt": question,
            "stream": False
        }
    )

    data = response.json()
    answer = data["response"]

    save_message(question, answer, model)

    return jsonify({
        "answer": answer,
        "model": model
    })


@app.route("/")
def home():
    return "AI Agent is running!"


app.run(host="0.0.0.0", port=5000)