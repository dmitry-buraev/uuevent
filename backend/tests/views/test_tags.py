# -*- coding: utf-8 -*-
from flask import json

from google.appengine.ext import ndb
from backend.tests import GaeFlaskTestCase
from backend.views.tags import TagREST
from backend import app
from backend.models import Tag

class TagRestTestCase(GaeFlaskTestCase):
    def test_get(self):
        with app.test_request_context():
            r = json.loads(TagREST().get().data)
            self.assertEquals(len(r), 4)
