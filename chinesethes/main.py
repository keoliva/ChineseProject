import os
import jinja2
import webapp2
import logging
from google.appengine.api import users
from google.appengine.ext import ndb

jinja_environment = jinja2.Environment(loader = jinja2.FileSystemLoader(os.path.dirname(__file__)))
                                       
class Struct(): pass
data = Struct()
data.main_info = {'user': users.get_current_user(),
        'login_url': users.create_login_url('/'),
        'logout_url': users.create_logout_url('/')}

class MainHandler(webapp2.RequestHandler):
    def get(self):
        if (data.main_info['user']):
            self.redirect('/enter')
        
        template_values = {}
        template_values.update(data.main_info)
        
        template = jinja_environment.get_template('home.html')
        self.response.write(template.render(template_values))

class EnterWordsHandler(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        login_url = users.create_login_url('/')
        logout_url = users.create_logout_url('/')

        template_values = {}
        template_values.update(data.main_info)

        template = jinja_environment.get_template('enter.html')
        self.response.write(template.render(template_values))
    def post(self):
        chi = self.request.get("chi")
        eng = self.request.get("eng")
        pinyin = self.request.get("pinyin")

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/enter', EnterWordsHandler),
], debug=True)
