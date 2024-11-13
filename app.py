from flask import Flask, render_template, request
from data import import_data, data_chart

app = Flask(__name__)

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
    data = import_data()
    return render_template('kontakt.jinja',
                           data_to_show = data.to_dict(orient="records"),
                           plot = data_chart(data))

@app.route('/polityka')
def polityka():
    return render_template('polityka.jinja')

if __name__ == "__main__":
    app.run(debug=True)
