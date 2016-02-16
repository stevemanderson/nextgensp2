import unittest
from ..api.notificationService import *
from ..services.settings import GMAIL_CONFIG

class NotificationServiceTests(unittest.TestCase):
    service = NotificationService(GmailSmtpSender(GMAIL_CONFIG))

    def test_send(self):
        NotificationServiceTests.service.send()

if __name__ == '__main__':
    unittest.main()
