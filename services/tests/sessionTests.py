import unittest

from api.models import *
from api.tree import *
from services.settings import *
import json

def createSessionService():
    mc = UserMongoContext('localhost', 27017)
    sqlC = SqlDataContext("nextgensp2", "postgres")
    return SessionService(mc, sqlC)

def createNotificationService():
    sender = HTMLFileCreator(TEMP_FOLDER+'/notificationservicetests_test_send.html')
    return NotificationService(sender)

def createHandler():
    c = DrupalDataContext(DRUPAL_API)
    ns = createNotificationService()
    return Handler(c, createSessionService(), createNotificationService())

class SessionTests(unittest.TestCase):
    def test_getById(self):
        query = SessionTests.dc.getById(375, 1)
        print query

if __name__ == '__main__':
    unittest.main()
