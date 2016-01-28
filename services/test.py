from api.models import *
from api.tree import *
from services.settings import *
import json

c = DrupalDataContext(DRUPAL_API)
h = Handler(c)
result = h.submitAnswer(22, 21, '')
print result
exit()
mc = UserMongoContext('localhost', 27017)

session = mc.get(1)
print 'The session is', session['id']
t = Tree(session['tree'])
for l in t.getLeafNodes():
    print l['id'], l['title'], l['type'], l['format']
exit()
session = {
    'id':1,
    'tree':c.getById(18)
}

mc.save(session)

exit()
