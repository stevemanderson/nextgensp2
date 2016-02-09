from api.models import *
from services.settings import *
import json

c = DrupalDataContext(DRUPAL_API)
mc = UserMongoContext('localhost', 27017)
sc = SessionService(mc)
h = Handler(c, sc)
print h.getById(18, 100)
