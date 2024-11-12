from flask import Flask, render_template, request
from flask_apscheduler import APScheduler

import pandas as pd
from eurodata import import_data

import plotly.graph_objects as go
import plotly.io as pio


data = pd.DataFrame()

scheduler = APScheduler()
app = Flask(__name__)
app.config['SCHEDULER_API_ENABLED'] = True

def fetch_data():
    global data
    data = import_data()
    print("fetching works")

def data_chart():
    global data

    fig = go.Figure(
        data=[
            go.Bar(
                x=data['Region'], 
                y=data['Suma odpadów wyprodukowana w 2022'],
                marker=dict(color='skyblue'),
                hoverinfo="y"
            )
        ]
    )
    
    fig.update_layout(
        xaxis_title='Region',
        yaxis_title='Suma odpadów wyprodukowana w 2022',
        template="plotly_white",
        width=1400, 
        height=1200,
        dragmode=False,
        hovermode=None, 
        showlegend=False
    )

    config = {
        'displayModeBar': False,    
        'scrollZoom': False,     
        'displaylogo': False,    
        'editable': False,        
        'showTips': False,             
        'className': 'custom-plotly-chart'  
    }

    chart_html = pio.to_html(fig, full_html=False, config=config)
    
    return chart_html


fetch_data()

data_plot = data_chart()

scheduler.add_job(id='GetData', func=fetch_data, trigger='interval', hours=24)
scheduler.add_job(id='ChartData', func=data_chart, trigger='interval', hours=24)
scheduler.init_app(app)
scheduler.start()

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
    return render_template('kontakt.jinja',
                           data_to_show = data.to_dict(orient="records"),
                           plot = data_plot)

@app.route('/polityka')
def polityka():
    return render_template('polityka.jinja')

if __name__ == "__main__":
    app.run(debug=True)
