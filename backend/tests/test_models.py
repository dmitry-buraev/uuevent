# -*- coding: utf-8 -*-

from backend.tests import GaeFlaskTestCase
from backend.models import Event, Category, Company, User, Interval

from hashlib import md5
import datetime

class ModelTestCase(GaeFlaskTestCase):
    def test_models(self):
        uk = User(email='budaev@mail.ru', password=u'secret').put()
        u = uk.get()
        self.assertEquals(u.password,
                u'%s%s' % (u.salt, md5(u'secret').hexdigest()))
        self.assertTrue(u.check_password(u'secret'))

        catkey = Category(name=u'Концерты').put()
        comkey = Company(name=u'Рассвет', employers=[uk]).put()

        e = Event(name=u'Ундервуд в Улан-Удэ',
                description=u'Первый концерт группы в городе',
                intervals = [Interval(
                    start_date=datetime.date.today())])
        e.company = comkey
        e.categories.append(catkey)
        e.put()
