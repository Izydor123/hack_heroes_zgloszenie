from flask import Flask, render_template, request
from flask_apscheduler import APScheduler
import pandas as pd
from eurodata import import_data


data = pd.DataFrame()
region = 'Polska'

scheduler = APScheduler()
app = Flask(__name__)

def fetch_data():
    global data
    data = import_data(region)
    
fetch_data()
scheduler.add_job(id='GetData', func=fetch_data, trigger='interval', hours=24)
scheduler.start()


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cennik')
def cennik():
    return render_template('cennik.html')

@app.route('/formularz')
def formularz():
    return render_template('formularz.html')

@app.route('/kadra')
def kadra():
    return render_template('kadra.html')

@app.route('/kontakt')
def kontakt():
    return render_template('kontakt.html')

@app.route('/polityka')
def polityka():
    return render_template('polityka.html')

@app.route('/second')
def second():
    return render_template('second.html')

if __name__ == "__main__":
    app.run(debug=True)