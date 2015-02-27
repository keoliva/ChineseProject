from google.appengine.api import users
from google.appengine.ext import ndb

class Word(ndb.Model):
    user = ndb.UserProperty()
    chinese = ndb.StringProperty()
    pinyin = ndb.StringProperty()
    english = ndb.StringProperty()

@ndb.tasklet
def callback(word):
    result = yield ndb.Key('Word', word.english).get_async()
    raise ndb.Return('%s' % result)

def fetch_words():
    #returns a tuple with a list of Chinese strings, list of pinyin strings
    # and list of english strings
    user = users.get_current_user()
    query = Word.query(Word.user == user)
    words = query.fetch()

    chi_list = map(lambda x: x.chinese, words)
    pinyin_list = map(lambda x: x.pinyin, words)
    eng_list = map(lambda x: x.english, words)

    #return (words, chi_list, pinyin_list, eng_list)
    return words
def make_lists(hugeList):
    pass
