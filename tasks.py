from celery import Celery
from app import celery, app, fetched_data
from data import import_data, data_chart

@celery.task
def update_data_task():
    global fetched_data
    global data_plot
    with app.app_context():
        fetched_data = import_data()
        data_plot = data_chart(fetched_data)
