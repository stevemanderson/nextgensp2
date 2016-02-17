import unittest

from ..api.models import *
from ..api.tree import *
from ..services.settings import *
import json

class SessionTests(unittest.TestCase):
    mc = UserMongoContext('localhost', 27017)
    sqlC = SqlDataContext("nextgensp2", "postgres")
    dc = DrupalDataContext(DRUPAL_API)
    sc = SessionService(mc, sqlC)

    # def test_create(self):
    #     SessionTests.sc.createSession(1)
    #     self.assertTrue(SessionTests.sc.sessionExists(1))
    #     SessionTests.sc.removeSession(1)

    def test_getById(self):
        query = SessionTests.dc.getById(375, 1)
        print query

if __name__ == '__main__':
    unittest.main()
