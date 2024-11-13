from celery import Celery
from app import celery, app, cached_data
from data import import_data
from datetime import datetime

@celery.task
def update_data_task():
    global cached_data
    with app.app_context():
        cached_data = import_data()
        print(f"Data updated at {datetime.now()}")