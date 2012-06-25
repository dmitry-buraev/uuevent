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
            tagid = request.args.get('tag')
            if tagid:
                tagkey = ndb.Key('Tag', int(tagid))
                events = Event.query(
                        ndb.AND(
                            Event.intervals.start_date == dt,
                            Event.tags == tagkey
                            )
                        ).fetch()
            else:
                events = Event.query(
                        Event.intervals.start_date == dt).fetch()

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
        'item_id': o.key.id(), 'watchword': o.watchword,
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
        'company': { 'id': o.company.id(), 'name': o.company.get().name },
        'tags': [{
            'id': t.key.id(),
            'name': t.name
            } for t in ndb.get_multi(o.tags)],
        }
