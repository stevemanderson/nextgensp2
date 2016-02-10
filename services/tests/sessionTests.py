import unittest

from ..api.models import *
from ..api.tree import *
from ..services.settings import *
import json

class SessionTests(unittest.TestCase):
    mc = UserMongoContext('localhost', 27017)
    sc = SessionService(mc)

    def test_create(self):
        SessionTests.sc.createSession(1)
        self.assertTrue(SessionTests.sc.sessionExists(1))
        SessionTests.sc.removeSession(1)

    def test_addResponse(self):
        SessionTests.sc.createSession(1)
        response = {
            'Id':1
        }
        parentQuery = {
            'Id':2
        }
        SessionTests.sc.addTracking(1, response, parentQuery)
        self.assertTrue(len(SessionTests.sc.getTracking(1)) == 1)
        SessionTests.sc.removeSession(1)

if __name__ == '__main__':
    unittest.main()
