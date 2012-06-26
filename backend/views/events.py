from google.appengine.ext import ndb
from flask import json, Response, request, abort
from flask.views import MethodView
from backend import app
from backend.models import Event, Tag
from datetime import date
from settings import DATE_FORMAT as DF, TIME_FORMAT as TF

class EventREST(MethodView):
    def get(self, id=None):
        if id is None:
            d = request.args.get('date', date.today().strftime(DF)).split('-')
            dt = date(int(d[0]), int(d[1]), int(d[2]))
            tagids = request.args.getlist('tags')
            if tagids:
                tagkeys = [ndb.Key('Tag', int(id)) for id in tagids]
                events = Event.query(
                        ndb.AND(
                            Event.intervals.start_date == dt,
                            Event.tags.IN(tagkeys)
                            )
                        ).fetch()
            else:
                events = Event.query(
                        Event.intervals.start_date == dt).fetch()

            res = [to_dict(e) for e in events]
        else:
            res = to_dict(Event.get_by_id(int(id)))
        return Response(json.dumps(res), mimetype='application/json')

event_view = EventREST.as_view('event_rest')
app.add_url_rule('/events/', view_func=event_view, methods=['GET',])
app.add_url_rule('/events/', view_func=event_view, methods=['POST',])
app.add_url_rule('/events/<id>', view_func=event_view,
        methods=['GET', 'PUT', 'DELETE'])

def to_dict(o):
    return {
        'item_id': o.key.id(), 'watchword': o.watchword,
        'description': o.description,
        'intervals': [{
            'start_date': i.start_date.strftime(DF),
            'start_time': i.start_time.strftime(TF
                ) if i.start_time is not None else None,
            'end_date': i.start_date.strftime(DF
                ) if i.end_date is not None else None,
            'end_time': i.end_time.strftime(TF
                ) if i.end_time is not None else None,
            } for i in o.intervals],
        'company': o.company.id(),
        'tags': [ t.id() for t in o.tags ],
        }
