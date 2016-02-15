import unittest
from ..api.notificationService import *

class NotificationServiceTests(unittest.TestCase):
    service = NotificationService()

    def test_send(self):
        NotificationServiceTests.service.send()

if __name__ == '__main__':
    unittest.main()
