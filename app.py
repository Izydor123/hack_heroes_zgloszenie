from flask import Flask, render_template, request, jsonify
from data import import_data, data_chart
from celery import Celery
from datetime import datetime
import os

app = Flask(__name__)

app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379/0',
    CELERY_RESULT_BACKEND='redis://localhost:6379/0'
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

cached_data = None

@app.route('/')
def index():
    return render_template('index.jinja')

@app.route('/cennik')
def cennik():
    return render_template('cennik.jinja')

@app.route('/formularz')
def formularz():
    return render_template('formularz.jinja')

@app.route('/kadra')
def kadra():
    return render_template('kadra.jinja')

@app.route('/kontakt')
def kontakt():
    global cached_data
    if cached_data is None:
        cached_data = import_data()
    return render_template('kontakt.jinja',
                           data_to_show=cached_data.to_dict(orient="records"),
                           plot=data_chart(cached_data))

@app.route('/polityka')
def polityka():
    return render_template('polityka.jinja')

if __name__ == "__main__":
    app.run(debug=True)