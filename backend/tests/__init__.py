# -*- coding: utf-8 -*-

import sys
import os
import unittest
import datetime as dt

from google.appengine.ext import testbed

from backend import app
from backend.models import Event, Interval, Category, Company, User

class GaeFlaskTestCase(unittest.TestCase):
    def setUp(self):
        #Disabling error catching
        app.config['TESTING'] = True
        app.config['CSRF_ENABLED'] = False
        self.app = app.test_client()

        #configure stubs
        self.testbed = testbed.Testbed()
        self.testbed.activate()
        self.testbed.init_datastore_v3_stub()
        self.testbed.init_memcache_stub()

        self.init_test_db()

    def tearDown(self):
        self.testbed.deactivate()

    @classmethod
    def init_test_db(self):
        u1 = User(email='budaev@mail.ru', password=u'secret').put()
        cat1 = Category(name=u'Концерты').put()
        com1 = Company(name=u'Рассвет', employers=[u1]).put()

        e1 = Event(name=u'Ундервуд в Улан-Удэ',
                description=u'Первый концерт группы в городе',
                intervals = [Interval(
                    start_date=dt.date.today(),
                    start_time=dt.time(19, 30))])
        e1.company = com1
        e1.categories.append(cat1)
        e1.put()

        e2 = Event(name=u'Би-2',
                description=u'Выступление легендарной группы',
                intervals = [Interval(
                    start_date=dt.date.today() + dt.timedelta(1),
                    start_time=dt.time(19, 30))])
        e2.company = com1
        e2.categories.append(cat1)
        e2.put()

        e3 = Event(name=u'Чайф',
                description=u'Ойййййооооооооооооооооооооо',
                intervals = [Interval(
                    start_date=dt.date.today() + dt.timedelta(2),
                    start_time=dt.time(19, 30))])
        e3.company = com1
        e3.categories.append(cat1)
        e3.put()
