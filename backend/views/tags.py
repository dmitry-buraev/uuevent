from google.appengine.ext import ndb
from flask import json, Response, request, abort
from flask.views import MethodView
from backend import app
from backend.models import Tag

class TagREST(MethodView):
    def get(self, id=None):
        if id is None:
            tags = Tag.query().fetch()
            res = [{ 'id': t.key.id(), 'name': t.name } for t in tags]
        else:
            res = {}
        return Response(json.dumps(res), mimetype='application/json')

tag_view = TagREST.as_view('tag_rest')
app.add_url_rule('/tags/', view_func=tag_view, methods=['GET',])
app.add_url_rule('/tags/', view_func=tag_view, methods=['POST',])
app.add_url_rule('/tags/<id>', view_func=tag_view,
        methods=['GET', 'PUT', 'DELETE'])
