import unittest
import json
from blackbox import BlackBox

class UserService:
	fields = [
			"Birth date", 
			"Family name", 
			"Given name", 
			"Locality Name", 
			"Lot Number", 
			"Postcode", 
			"Road name", 
			"Road number 1", 
			"Road Type Code", 
			"State or Territory Code", 
			"Telephone Number",
			"Email", 
			"Licence number"
		]

	def __init__(self, userType):
		self.userType = userType

	def getAnonymous(self):
		return '{"fields":[],"userId":"1"}'

	def getLevel1(self):
		return '{"fields":'+json.dumps(UserService.fields)+',"userId":"1"}'

	def getLevel2(self):
		return '{"fields":'+json.dumps(UserService.fields)+',"userId":"1"}'

	def getUser(self):
		if self.userType == 'anonymous':
			return self.getAnonymous()
		elif self.userType == 'level1':
			return self.getLevel1()
		elif self.userType == 'level2':
			return self.getLevel2()
		else:
			return ""

class blackboxTests(unittest.TestCase):
	apiUrl = "http://mstrong.info/api/views/dtmr_personalised_service.json"

	def test_apiConnection(self):
		box = BlackBox(blackboxTests.apiUrl, UserService('anonymous'))
		content = box.getContent()
		self.assertTrue(len(content) > 0)

	def test_anonymous(self):
		service = UserService('anonymous')
		box = BlackBox(blackboxTests.apiUrl, UserService('anonymous'))
		content = box.getContent()


if __name__ == '__main__':
    unittest.main()