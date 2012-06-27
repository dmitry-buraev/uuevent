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
            args = request.args
            count = int(args.get('count', 15))
            offset = int(args.get('offset', 0))
            d = args.get('date', date.today().strftime(DF)).split('-')
            dt = date(int(d[0]), int(d[1]), int(d[2]))
            tagids = args.getlist('tags')
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
                        Event.intervals.start_date == dt).fetch(
                                count+1, offset=offset)

            r = [to_dict(e, dt) for e in events]
            more = len(r) > count#Flag shows there are more results to display
            res = { 'more': more, 'events': r[:-1] if more else r }
        else:
            res = to_dict(Event.get_by_id(int(id)))
        return Response(json.dumps(res), mimetype='application/json')

event_view = EventREST.as_view('event_rest')
app.add_url_rule('/events/', view_func=event_view, methods=['GET',])
app.add_url_rule('/events/', view_func=event_view, methods=['POST',])
app.add_url_rule('/events/<id>', view_func=event_view,
        methods=['GET', 'PUT', 'DELETE'])

def to_dict(o, dt=None):
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
            } for i in o.intervals if (
                (i.start_date == dt) if dt is not None else True)], #FIXME: It's ugly
        'company': o.company.id(),
        'tags': [ t.id() for t in o.tags ],
        }
