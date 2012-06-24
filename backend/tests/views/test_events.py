# -*- coding: utf-8 -*-
from flask import json

from google.appengine.ext import ndb
from backend.tests import GaeFlaskTestCase
from backend.views.events import EventREST
from backend import app
from backend.models import Event

class EventRestTestCase(GaeFlaskTestCase):
    def test_to_dict(self):
        from backend.views.events import to_dict
        e = Event.query(Event.name == u'Чайф').get()
        self.assertEquals(to_dict(e), {
            'id': e.key.id(), 'name': e.name,
            'description': e.description,
            'intervals': [{
                'start_date': i.start_date.strftime('%Y-%m-%d'),
                'start_time': i.start_time.strftime(
                    '%H:%M') if i.start_time is not None else None,
                'end_date': i.start_date.strftime(
                    '%Y-%m-%d') if i.end_date is not None else None,
                'end_time': i.start_time.strftime(
                    '%H:%M') if i.end_time is not None else None,
                } for i in e.intervals],
            'company': e.company.id(),
            'category': [c.id() for c in e.categories],
            });

    def test_get(self):
        with app.test_request_context():
            r = json.loads(EventREST().get().data)
            self.assertEquals(len(r), 3)
            eid = Event.query(Event.name == u'Чайф').get().key.id()
            r = json.loads(EventREST().get(eid).data)
            self.assertEquals(r['name'], u'Чайф')
