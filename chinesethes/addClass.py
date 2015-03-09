class Words(object):
    def __init__(self,chi,english,pinyin):
        self.chi = chi
        self.english = english
        self.pinyin = pinyin

def find_square(n):
        (root, square) = (1, 1)
        while (square < n):
            root += 1
            square = root ** 2
        return root
        
class Add(object):
    def find_sum(self,x):
        return [Words('真的吗','zhen1de2ma','really'),
                Words('新鲜','xin1xian4','fresh'),
                Words('桌子','zhuo1zi4','table'),
                Words('疯狂','feng1kuang4','crazy'),
                Words('对不起','dui4bu4qi3','sorry'),
                Words('中文','zhong1wen2','chinese'),
                Words('了解','liao3jie3','understand')]
    def html_dict(self):
        words = self.find_sum(5)
        descriptions = map(lambda x: (x.chi,x.english,x.pinyin), words)
        eng_words = map(lambda x: x[1], descriptions)
        
        max_len_eng = reduce(lambda x,y: x if len(x)>len(y) else y, eng_words)

        max_len_eng  = len(max_len_eng)
        n = len(words)
        
        root = find_square(n)
        content = dict()

        div = n/root
        for j in range(div + 1):
            index = j * root
            if (j == div):
                content[j] = words[index:]
            content[j] = words[index: index + root]
        return [content, max_len_eng, root]
