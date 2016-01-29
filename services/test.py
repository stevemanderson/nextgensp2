from api.models import *
from api.tree import *
from services.settings import *
import json

c = DrupalDataContext(DRUPAL_API)
mc = UserMongoContext('localhost', 27017)
sc = SessionService(mc)
h = Handler(c, sc)
l = "193,68,28,27,25"

result = h.submitAnswers(l.split(','), 23, 'cb1c82d4-43c2-aa23-ffae-5c5b65d504f3')
print result
exit()

sc.createSession(1)
sc.addService(1, {'id':1})
sc.removeService(1, 1)

exit()
