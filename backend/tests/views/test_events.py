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
        e = Event.query(Event.watchword == u'Ундервуд в Улан-Удэ').get()
        self.assertEquals(to_dict(e), {
            'item_id': e.key.id(), 'watchword': e.watchword,
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
            'company': {
                'id': e.company.id(), 'name': e.company.get().name},
            'tags': [{
                'id': c.id(), 'name': c.get().name
                } for c in e.tags],
            });

    def test_get(self):
        with app.test_request_context():
            r = json.loads(EventREST().get().data)
            self.assertEquals(len(r), 1)
            eid = Event.query(
                    Event.watchword == u'Ундервуд в Улан-Удэ'
                    ).get().key.id()
            r = json.loads(EventREST().get(eid).data)
            self.assertEquals(r['watchword'], u'Ундервуд в Улан-Удэ')
