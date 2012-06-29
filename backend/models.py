from google.appengine.ext import ndb

class User(ndb.Model):
    name = ndb.StringProperty()
    email = ndb.StringProperty(required=True)
    password = ndb.StringProperty(required=True)
    created = ndb.DateProperty(auto_now_add=True)
    salt = ndb.StringProperty()

    def _pre_put_hook(self):
        self.salt = self.gen_salt()
        self.password = self.gen_password(self.salt, self.password)

    def gen_salt(self):
        from random import choice
        letters = 'abcdefghijklmnopqrstuvwxyz'
        salt = []
        for i in range(12):
            salt.append(choice(letters))

        return u''.join(salt)

    def gen_password(self, salt, passw):
        from hashlib import md5
        return  u'%s%s' % (salt, md5(passw).hexdigest())

    def check_password(self, passw):
        return self.password == self.gen_password(self.salt, passw)


class Tag(ndb.Model):
    name = ndb.StringProperty(required=True)

class Company(ndb.Model):
    name = ndb.StringProperty(required=True)
    employers = ndb.KeyProperty('User', repeated=True)
    tags = ndb.KeyProperty('Tag', repeated=True)

class Interval(ndb.Model):
    start_date = ndb.DateProperty(required=True)
    start_time = ndb.TimeProperty()
    end_date = ndb.DateProperty()
    end_time = ndb.TimeProperty()

class Event(ndb.Model):
    watchword = ndb.StringProperty(required=True)
    description = ndb.StringProperty()
    intervals = ndb.StructuredProperty(Interval, repeated=True)
    company = ndb.KeyProperty('Company')
    tags = ndb.KeyProperty('Tag', repeated=True)
