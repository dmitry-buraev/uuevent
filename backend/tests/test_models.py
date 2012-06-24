# -*- coding: utf-8 -*-

from backend.tests import GaeFlaskTestCase
from backend.models import User

from hashlib import md5
import datetime

class ModelTestCase(GaeFlaskTestCase):
    def test_models(self):
        u = User.query(User.email == 'budaev@mail.ru').get()
        self.assertEquals(u.password,
                u'%s%s' % (u.salt, md5(u'secret').hexdigest()))
        self.assertTrue(u.check_password(u'secret'))
