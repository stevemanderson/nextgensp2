import unittest
from ..api.notificationService import *
from ..services.settings import GMAIL_CONFIG, TEMP_FOLDER

class NotificationServiceTests(unittest.TestCase):
    def test_gmail(self):
        service = NotificationService(GmailSmtpSender(GMAIL_CONFIG))

    def test_send(self):
        service = NotificationService(HTMLFileCreator(TEMP_FOLDER+'/notificationservicetests_test_send.html'))
        service.send('', {
            'url':'http://www.google.ca',
            'name':'Steve Anderson',
            'phone_no':'8294322343',
            'referrer_name':'Ref Name',
            'referrer_phone_no':'23488947473'})

if __name__ == '__main__':
    unittest.main()
