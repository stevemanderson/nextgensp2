from api.models import *
from api.tree import *
from services.settings import *
import json
import pprint

c = DrupalDataContext(DRUPAL_API)
mc = UserMongoContext('localhost', 27017)
sc = SessionService(mc)
h = Handler(c, sc)

result = h.getById(121, 1, True)

#result = h.getById(113, 1)

print result
