from api.models import *
from services.settings import *
import json

c = DrupalDataContext(DRUPAL_API)
mc = UserMongoContext('localhost', 27017)
sqlC = SqlDataContext("nextgensp2", "postgres")
sc = SessionService(mc, sqlC)
h = Handler(c, sc)
print h.getById(18, 100)
