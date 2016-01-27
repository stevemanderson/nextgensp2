from api.models import DrupalDataContext, Handler
from services.settings import DRUPAL_API
from api.tree import Tree
import json

h = Handler()
query = h.getQuery('Do you need help getting started?')
print json.dumps(query)
exit()

from services.settings import DRUPAL_API
from api.tree import Tree
import time
import json

c = DrupalDataContext(DRUPAL_API)
t = Tree(1, 'Some Title', c.getById(18))

from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client.test_database
db.test_collection.insert(t.root)
