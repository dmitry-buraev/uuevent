from flask import json, jsonify, Response
from flask.views import MethodView
from backend import app
from backend.models import Event
from settings import DATE_FORMAT as DF, TIME_FORMAT as TF

class EventREST(MethodView):
    def get(self, id=None):
        if id is None:
            events = Event.query().fetch()
            res = [to_dict(e) for e in events]
        else:
            res = to_dict(Event.get_by_id(id))
        return Response(json.dumps(res), mimetype='application/json')

event_view = EventREST.as_view('event_rest')
app.add_url_rule('/events/', view_func=event_view, methods=['GET',])
app.add_url_rule('/events/', view_func=event_view, methods=['POST',])
app.add_url_rule('/events/<id>', view_func=event_view,
        methods=['GET', 'PUT', 'DELETE'])

def to_dict(o):
    return {
        'id': o.key.id(), 'name': o.name,
        'description': o.description,
        'intervals': [{
            'start_date': i.start_date.strftime(DF),
            'start_time': i.start_time.strftime(TF
                ) if i.start_time is not None else None,
            'end_date': i.start_date.strftime(DF
                ) if i.end_date is not None else None,
            'end_time': i.start_time.strftime(TF
                ) if i.end_time is not None else None,
            } for i in o.intervals],
        'company': o.company.id(),
        'category': [c.id() for c in o.categories],
        }
