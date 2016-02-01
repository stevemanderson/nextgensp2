from api.models import *
from api.tree import *
from services.settings import *
import json
import pprint

c = DrupalDataContext(DRUPAL_API)

for n in c.getQueriesWithNoChildren():
    print n['id'], n['title']

exit()
mc = UserMongoContext('localhost', 27017)
sc = SessionService(mc)
h = Handler(c, sc)

result = h.getById(167, 1)
#result = h.getById(113, 1)

print result
