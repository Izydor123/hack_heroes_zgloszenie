from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Quiz data
questions = [
    {
        "question": "What is the capital of France?",
        "options": ["Paris", "Berlin", "Madrid", "Rome"],
        "answer": "Paris"
    },
    {
        "question": "What is 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "answer": "4"
    },
    {
        "question": "Which programming language is Flask based on?",
        "options": ["Python", "Java", "C++", "Ruby"],
        "answer": "Python"
    }
]

@app.route('/')
def quiz():
    return render_template('quiz.html', questions=questions)

@app.route('/submit', methods=['POST'])
def submit():
    correct = 0
    total = len(questions)

    # Check user's answers
    for i, question in enumerate(questions):
        user_answer = request.form.get(f"question-{i}")
        if user_answer == question["answer"]:
            correct += 1

    # Return JSON response
    return jsonify(correct=correct, total=total)

if __name__ == '__main__':
    app.run(debug=True)
