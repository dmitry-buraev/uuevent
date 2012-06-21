from flask import Flask, session, g
import settings

app = Flask(__name__)
app.config.from_object('settings')


