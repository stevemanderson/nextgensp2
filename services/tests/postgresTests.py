import unittest

from ..api.models import *
from ..api.tree import *
from ..services.settings import *
import json

class PostgresTests(unittest.TestCase):
    context = SqlDataContext('nextgensp2', 'postgres')

    def test_insertTracking(self):
        PostgresTests.context.addTracking({'sessionId':'1', 'queryId':1, 'selectionId':1})

if __name__ == '__main__':
    unittest.main()
