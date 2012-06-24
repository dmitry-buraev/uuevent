# -*- coding: utf-8 -*-
import sys
import os
import unittest
import datetime as dt

from google.appengine.ext import testbed

from backend import app
from backend.models import Event, Interval, Tag, Company, User

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
        tag1 = Tag(name=u'Концерты').put()
        tag2 = Tag(name=u'Блюз-рок').put()
        tag3 = Tag(name=u'Психоделический-рок').put()
        tag4 = Tag(name=u'Кино').put()
        com1 = Company(name=u'Рассвет', employers=[u1]).put()
        com2 = Company(name=u'Прогресс').put()

        e1 = Event(watchword=u'Ундервуд в Улан-Удэ',
                description=u'Первый концерт группы в городе',
                intervals = [Interval(
                    start_date=dt.date.today(),
                    start_time=dt.time(19, 30))])
        e1.company = com1
        e1.tags.append(tag1)
        e1.put()

        e2 = Event(watchword=u'Би-2 c единственным концертом в городе',
                description=u'Выступление легендарной группы',
                intervals = [Interval(
                    start_date=dt.date.today() + dt.timedelta(1),
                    start_time=dt.time(19, 30))])
        e2.company = com1
        e2.tags.append(tag1)
        e2.put()

        e3 = Event(watchword=u'Да-да, Джим снова жив. Встречайте The Doors. ',
                description=u'I\'m crawling king snake',
                intervals = [Interval(
                    start_date=dt.date.today() + dt.timedelta(2),
                    start_time=dt.time(19, 30))])
        e3.company = com1
        e3.tags.append(tag1)
        e3.tags.append(tag2)
        e3.tags.append(tag3)
        e3.put()

        e4 = Event(watchword=u'Премьера: Хоббит',
                description=u'Продолжение легендарной трилогии',
                intervals = [
                    Interval(
                        start_date=dt.date.today() + dt.timedelta(1),
                        start_time=dt.time(10, 30),
                        end_date=dt.date.today() + dt.timedelta(1),
                        end_time=dt.time(12, 30),
                        ),
                    Interval(
                        start_date=dt.date.today() + dt.timedelta(1),
                        start_time=dt.time(15, 45),
                        end_date=dt.date.today() + dt.timedelta(1),
                        end_time=dt.time(17, 45),
                        ),
                    Interval(
                        start_date=dt.date.today() + dt.timedelta(1),
                        start_time=dt.time(19, 20),
                        end_date=dt.date.today() + dt.timedelta(1),
                        end_time=dt.time(21, 20),
                        ),
                    Interval(
                        start_date=dt.date.today() + dt.timedelta(1),
                        start_time=dt.time(22, 30),
                        end_date=dt.date.today() + dt.timedelta(1),
                        end_time=dt.time(00, 30),
                        ),
                        ])
        e4.company = com2
        e4.tags.append(tag4)
        e4.put()
