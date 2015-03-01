import os
import jinja2
import webapp2
import logging
import json
import pickle
import necessaryQueries
import addClass
from google.appengine.api import users
from google.appengine.ext import ndb

class Word(ndb.Model):
    user = ndb.UserProperty()
    chinese = ndb.StringProperty()
    pinyin = ndb.StringProperty()
    english = ndb.StringProperty()

def jsonfilter(value):
    return json.dumps(value)

jinja_environment = jinja2.Environment(loader = jinja2.FileSystemLoader(os.path.dirname(__file__)))
#jinja_environment.filters['json'] = jsonfilter

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

        self.get()

class EditWordsHandler(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()

        words = necessaryQueries.fetch_words()
        data.words = words
        data.len = len(words)
        
        template_values = {'user': user, 'words': words,
                           #'pinyin_list': pinyin_list, 'eng_list': eng_list,
        'logout_url': users.create_logout_url('/')}
        
        template = jinja_environment.get_template('edit.html')
        self.response.write(template.render(template_values))

    def post(self):
        if (hasattr(data, 'words') == False):
            data.words = necessaryQueries.fetch_words()
            data.len = len(data.words)

        for i in range(data.len): #number of entries
            key = data.words[i].key
            
            chi = self.request.get("chi%d" % i)
            pinyin = self.request.get("pinyin%d" % i)
            eng = self.request.get("eng%d" % i)

            word = key.get()
            word.chinese,word.pinyin,word.english = chi,pinyin,eng
            word.put()
            
        self.get()
        
class WritingHandler(webapp2.RequestHandler):
    def get(self):
        x = addClass.Words('中','center','zhong1')
        word = pickle.dumps(x.__dict__)
        word_dict = pickle.loads(word)
        template_values = {'user': users.get_current_user(),
        'logout_url': users.create_logout_url('/'),
        'word':word_dict}
        
        template = jinja_environment.get_template('write.html')
        self.response.write(template.render(template_values))

    def post(self):
        text = self.request.get("textarea")
        data.text = text

        self.get()

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/enter', EnterWordsHandler),
    ('/edit', EditWordsHandler),
    ('/write', WritingHandler),
], debug=True)
