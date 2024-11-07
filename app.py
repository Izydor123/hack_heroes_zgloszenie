from flask import Flask, render_template, request

import pandas as pd

from eurodata import import_data

data = import_data()
region = 'Polska'

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html',
                           region = region,
                           dataToPrint = data.loc[[region]].to_html(classes='table'))

if __name__ == '__main__':
    app.run(host="127.0.0.1",port=5000)