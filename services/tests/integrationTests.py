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
    def test(self):
        handler = createHandler()

        #create session
        #handler.createSession(1)

        #get the items
        query = handler.getById(290, 1) 
        service = handler.getById(291, 1) 

        #handler.addServiceTracking(1, service, query)

        #remove
        handler.removeServiceTracking(1, service['id'], query['id'])

if __name__ == '__main__':
    unittest.main()
