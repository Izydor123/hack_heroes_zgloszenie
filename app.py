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
        "question": "Do jakiego pojemnika należy wyrzucać ceramikę?",
        "options": ["Na odpady zmieszane", "Na szkło", "Na papier"],
        "answer": "Na odpady zmieszane"
    },
    {
        "index": "2",
        "question": "Co można wrzucić do brązowego pojemnika?",
        "options": ["Kości z rosołu", "Przetłuszczony papier", "Zgniłe owoce"],
        "answer": "Zgniłe owoce"
    },
    {
        "index": "3",
        "question": "Czy podczas wyrzucania butelek trzeba je oddzielać od korków?",
        "options": ["Tak","Nie"],
        "answer": "Tak"
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
    return render_template('dane.html',
                           euro_plot=euro_data_plot,
                           pl_all_plots = pl_all_waste,
                           pl_communal_plots  = pl_communal_waste)

@app.route('/minigra')
def minigra():
    return render_template('minigra.html')

@app.route('/segregacja')
def segregacja():
    return render_template('segregacja.html', questions=questions)

@app.route('/zagrozenia')
def zagrozenia():
    return render_template('zagrozenia.html')

@app.route('/submit', methods=['POST'])
def submit():
    correct = 0
    total = len(questions)

    for question in questions:
        user_answer = request.form.get(f"question-{question['index']}")
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
                           """
