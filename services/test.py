from api.models import *
from api.tree import *
from services.settings import *
import json
import pprint

c = DrupalDataContext(DRUPAL_API)
mc = UserMongoContext('localhost', 27017)
sc = SessionService(mc)
h = Handler(c, sc)
l = "193,68,28,27,25"

result = h.submitAnswers(l.split(','), 23, 1)

session = h.getSession(1)
print session

h.removeSession(1)
exit()
