from django.test import TestCase
from api.messaging import *

class MessageServiceTests(TestCase):
    def test_send(self):
    	service = MessageService()
    	service.send()
