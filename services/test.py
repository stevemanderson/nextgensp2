from api.models import *
from api.tree import *
from services.settings import *
import json

c = DrupalDataContext(DRUPAL_API)
mc = UserMongoContext('localhost', 27017)
sc = SessionService(mc)
h = Handler(c, sc)

result = h.submitAnswer(33, 30, '', 1)

print result

exit()
