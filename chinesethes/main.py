import os
import jinja2
import webapp2
import logging
import necessaryQueries
from google.appengine.api import users
from google.appengine.ext import ndb

class Word(ndb.Model):
    user = ndb.UserProperty()
    chinese = ndb.StringProperty()
    pinyin = ndb.StringProperty()
    english = ndb.StringProperty()

jinja_environment = jinja2.Environment(loader = jinja2.FileSystemLoader(os.path.dirname(__file__)))
                                       
class Struct(): pass
data = Struct()
data.main_info = {'user': users.get_current_user(),
        'login_url': users.create_login_url('/'),
        'logout_url': users.create_logout_url('/')}

class MainHandler(webapp2.RequestHandler):
    def get(self): 
        template_values = {'user': users.get_current_user(),
        'login_url': users.create_login_url('/enter'),
        'logout_url': users.create_logout_url('/')}
        #template_values.update(data.main_info)
        
        template = jinja_environment.get_template('home.html')
        self.response.write(template.render(template_values))

class EnterWordsHandler(webapp2.RequestHandler):
    def get(self):
        template_values = {'user': users.get_current_user(),
        'logout_url': users.create_logout_url('/')}

        template = jinja_environment.get_template('enter.html')
        self.response.write(template.render(template_values))
        
    def post(self):
        chi = self.request.get("chi")
        pinyin = self.request.get("pinyin")
        eng = self.request.get("eng")
        
        word = Word(user = users.get_current_user(),
                    chinese = chi,
                    pinyin = pinyin,
                    english = eng)
        word.put()

        template_values = {'user': users.get_current_user(),
        'logout_url': users.create_logout_url('/')}

        template = jinja_environment.get_template('enter.html')
        self.response.write(template.render(template_values))

class EditWordsHandler(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()

        (chi_list, pinyin_list, eng_list) = necessaryQueries.fetch_words()
        
        template_values = {'user': user, 'chi_list': chi_list,
                           'pinyin_list': pinyin_list, 'eng_list': eng_list,
        'logout_url': users.create_logout_url('/')}
        
        template = jinja_environment.get_template('edit.html')
        self.response.write(template.render(template_values))

    def post(self):
        #query for all instances
        template_values = {'user': users.get_current_user(),
        'logout_url': users.create_logout_url('/')}
        
        template = jinja_environment.get_template('edit.html')
        self.response.write(template.render(template_values))

class WritingHandler(webapp2.RequestHandler):
    def get(self): 
        template_values = {'user': users.get_current_user(),
        'logout_url': users.create_logout_url('/')}
        
        template = jinja_environment.get_template('write.html')
        self.response.write(template.render(template_values))

    def post(self):
        template_values = {'user': users.get_current_user(),
        'logout_url': users.create_logout_url('/')}
        
        template = jinja_environment.get_template('write.html')
        self.response.write(template.render(template_values))

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/enter', EnterWordsHandler),
    ('/edit', EditWordsHandler),
    ('/write', WritingHandler),
], debug=True)
