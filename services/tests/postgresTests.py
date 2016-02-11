import unittest

from ..api.models import *
from ..api.tree import *
from ..services.settings import *
import json

class PostgresTests(unittest.TestCase):
    context = SqlDataContext('nextgensp2', 'postgres')

    def test_insertTracking(self):
        PostgresTests.context.addTracking(1, {'query':{'id':1}, 'selection':{'id':2}})

if __name__ == '__main__':
    unittest.main()
