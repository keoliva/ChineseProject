import os
import jinja2
import webapp2
import logging
from google.appengine.api import users
from google.appengine.ext import ndb

class Character(ndb.Model):

jinja_environment = jinja2.Environment(loader = jinja2.FileSystemLoader(os.path.dirname(__file__)))
                                       

class MainHandler(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        login_url = users.create_login_url('/')
        logout_url = users.create_logout_url('/')
        
        template_values = {'user':user, 'login_url':login_url,
        'logout_url':logout_url}
        template = jinja_environment.get_template('home.html')
        self.response.write(template.render(template_values)

app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
