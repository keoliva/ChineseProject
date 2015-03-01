class Words(object):
    def __init__(self,chi,english,pinyin):
        self.chi = chi
        self.english = english
        self.pinyin = pinyin
        self.fn = lambda x: self.yomama(x)
    def yomama(self, x):
        return x+"hhhhhhhhhhh"
        
class Add():
    @classmethod 
    def find_sum(cls,x):
        return x
    
x = Words('中','center','zhong1')
