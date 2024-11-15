from flask import Flask, render_template, request, jsonify
from eurodata import import_data, data_chart
from pldata import PLWasteCharts
from celery import Celery

app = Flask(__name__)

app.config.update(
    CELERY_BROKER_URL='redis://red-csqelgd6l47c73dsk9sg:6379',
    CELERY_RESULT_BACKEND='redis://red-csqelgd6l47c73dsk9sg:6379'
)

def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    celery.conf.update(app.config)
    TaskBase = celery.Task
    class ContextTask(TaskBase):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)
    celery.Task = ContextTask
    return celery

celery = make_celery(app)   

euro_fetched_data = import_data()
euro_data_plot = data_chart(euro_fetched_data)

pl_all_waste = PLWasteCharts('odpady_ogolne.csv')
pl_communal_waste = PLWasteCharts('odpady_komunalne.csv')

questions = [
    {
        "index": "1",
        "question": "What is the capital of France?",
        "options": ["Paris", "Berlin", "Madrid", "Rome"],
        "answer": "Paris"
    },
    {
        "index": "2",
        "question": "What is 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "answer": "4"
    },
    {
        "index": "3",
        "question": "Which programming language is Flask based on?",
        "options": ["Python", "Java", "C++", "Ruby"],
        "answer": "Python"
    }
]




@app.route('/')
def index():
    return render_template('index.html')

@app.route('/artykuly')
def artykuly():
    return render_template('artykuly.html')

@app.route('/autorzy')
def autorzy():
    return render_template('autorzy.html')

@app.route('/kadra')
def kadra():
    return render_template('kadra.html')

@app.route('/dane')
def dane():
    global euro_fetched_data
    global euro_data_plot
    global pl_all_waste
    global pl_communal_waste
    return render_template('dane.html')

@app.route('/minigra')
def minigra():
    return render_template('minigra.html')

@app.route('/segregacja')
def segregacja():
    return render_template('segregacja.html')

@app.route('/zagrozenia')
def zagrozenia():
    return render_template('zagrozenia.html')

@app.route('/quiz')
def quiz():
    return render_template('quiz.html', questions=questions)

@app.route('/submit', methods=['POST'])
def submit():
    correct = 0
    total = len(questions)

    for i, question in enumerate(questions):
        user_answer = request.form.get(f"question-{i}")
        if user_answer == question["answer"]:
            correct += 1

    return jsonify(correct=correct, total=total)

if __name__ == "__main__":
    app.run(debug=True)

    """@app.route('/kontakt')
def kontakt():
    global euro_fetched_data
    global euro_data_plot
    global pl_all_waste
    global pl_communal_waste
    return render_template('kontakt.html',
                           euro_data_to_show=euro_fetched_data.to_dict(orient="records"),
                           euro_plot=euro_data_plot,
                           pl_all_plots = pl_all_waste,
                           pl_communal_plots  = pl_communal_waste)"""
