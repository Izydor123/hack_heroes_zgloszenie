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
    return render_template('index.html',
                           region = region,
                           dataToPrint = data.to_html(classes='table'))

@app.route('/second')
def second():
    return render_template('second.html')

if __name__ == "__main__":
    app.run(debug=True)