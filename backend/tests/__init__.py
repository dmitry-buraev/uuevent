import sys
import os
import unittest

from google.appengine.ext import testbed

from backend import app

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

    def tearDown(self):
        self.testbed.deactivate()
