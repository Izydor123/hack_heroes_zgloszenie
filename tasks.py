from celery import Celery
from app import celery, app, euro_fetched_data
from eurodata import import_data, data_chart
from pldata import PLWasteCharts

@celery.task
def update_data_task():
    global euro_fetched_data
    global euro_data_plot
    global pl_all_waste
    global pl_communal_waste
    with app.app_context():
        euro_fetched_data = import_data()
        euro_data_plot = data_chart(euro_fetched_data)
        pl_all_waste = PLWasteCharts('odpady_ogolne.csv')
        pl_communal_waste = PLWasteCharts('odpady_komunalne.csv')
        