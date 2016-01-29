from api.models import *
from api.tree import *
from services.settings import *
import json

c = DrupalDataContext(DRUPAL_API)
mc = UserMongoContext('localhost', 27017)
sc = SessionService(mc)

print c.getById(149, 3)

exit()
sc.createSession(1)
sc.addService(1, {'id':1})
sc.removeService(1, 1)
exit()
