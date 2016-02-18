import unittest
from api.models import *
from api.notificationService import *
from services.settings import *

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

class integrationTests(unittest.TestCase):
    sessionId = "f4f251d7-cef7-290f-1cf9-c5e53ffa43d8"

    def test_removeSession(self):
        handler = createHandler()
        handler.removeSession(integrationTests.sessionId)
        self.assertFalse(handler.sessionExists(integrationTests.sessionId))

    def test_addService(self):
        handler = createHandler()

        #create session
        handler.createSession(integrationTests.sessionId)

        #get the items
        query = handler.getById(375, 1) 
        service = handler.getById(517, 1) 

        handler.addServiceTracking(integrationTests.sessionId, service, query)

    def test_checkOneEntry(self):
        result = createHandler().getServices(integrationTests.sessionId)
        self.assertTrue(len(result) == 1)

    def test_removeService(self):
        handler = createHandler()

        qId = "375"
        sId = "517"

        #remove
        handler.removeServiceTracking(integrationTests.sessionId, int(sId), int(qId))

    def test_checkNoEntries(self):         
        handler = createHandler()
        result = createHandler().getServices(integrationTests.sessionId)
        self.assertTrue(len(result) == 0)

    def test_getServices(self):
        handler = createHandler()
        print handler.getServices(integrationTests.sessionId)

if __name__ == '__main__':
    unittest.main()
