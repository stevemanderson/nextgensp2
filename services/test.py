from api.models import DrupalDataContext
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
