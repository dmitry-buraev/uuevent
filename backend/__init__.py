# -*- coding: utf-8 -*-
from flask import Flask, session, g, render_template
import settings

app = Flask(__name__)
app.config.from_object('settings')

@app.route('/')
def root():
    return render_template('root.html')

from .views import events, tags


#for dev
#from backend.tests import GaeFlaskTestCase
#GaeFlaskTestCase.init_test_db()
