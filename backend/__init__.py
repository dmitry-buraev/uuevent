from flask import Flask, session, g, render_template
import settings

app = Flask(__name__)
app.config.from_object('settings')

@app.route('/')
def root():
    return render_template('root.html')
