from celery import Celery
from app import celery
from datetime import timedelta

celery.conf.beat_schedule = {
    'update-data-every-hour': {
        'task': 'tasks.update_data_task',
        'schedule': timedelta(seconds=10),
    },
}

if __name__ == "__main__":
    celery.start()