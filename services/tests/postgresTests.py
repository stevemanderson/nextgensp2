import unittest

from ..api.models import *
from ..api.tree import *
from ..services.settings import *
import json

class PostgresTests(unittest.TestCase):
    context = SqlDataContext('nextgensp2', 'postgres')

    def test_insertTracking(self):
        PostgresTests.context.addTracking(1, {'query':{'id':1, 'type':'query', 'title':'Testing the query'}, 'selection':{'id':2, 'type':'response', 'title':'Testing the response'}})

if __name__ == '__main__':
    unittest.main()
