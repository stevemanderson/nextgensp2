import unittest
import json
from services import UserService
from blackbox import BlackBox
from widgetmappers import ServiceWidgetMapper

class TestUserService:
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
		return '{"fields":[],"userId":1}'

	def getSomeFieldsUser(self):
		return '{"fields":'+json.dumps(TestUserService.fields[0:9])+',"userId":1}'

	def getAllFieldsUser(self):
		return '{"fields":'+json.dumps(TestUserService.fields)+',"userId":1}'


	def getUser(self):
		if self.userType == 'anonymous':
			return json.loads(self.getAnonymous())
		elif self.userType == 'somefields':
			return json.loads(self.getSomeFieldsUser())
		elif self.userType == 'allfields':
			return json.loads(self.getAllFieldsUser())
		else:
			return ""

class blackboxTests(unittest.TestCase):
	apiUrl = "http://54.206.52.78/api/views/dtmr_personalised_service.json"

	def test_apiConnection(self):
		box = BlackBox(blackboxTests.apiUrl, TestUserService('anonymous'))
		content = box.getContent()
		self.assertTrue(len(content) > 0)

	def test_singleSearchOnService(self):
		box = BlackBox(blackboxTests.apiUrl, TestUserService('anonymous'))
		services = box.getServices("Application")
		self.assertTrue(len(services) == 1)

	def test_singleSearchOnServiceLowercase(self):
		box = BlackBox(blackboxTests.apiUrl, TestUserService('anonymous'))
		services = box.getServices("application")
		self.assertTrue(len(services) == 1)

	# RETURNED SERVICE
	# {
	# 	"title" : "Apply for Adult Proof of Age Card",
	# 	"department" : "DTMR",
	# 	"image" : null,
	# 	"required application data (custom)" : "Email, Licence number",
	# 	"service description" : "This service allows customers to apply for Adult Proof of Age card which:\r\n- provides proof of age for Queenslanders aged 18 years or older\r\n- is an ideal form of photo identification for people who don\u2019t hold a driver licence or passport.",
	# 	"suggested action statement" : "Adult proof of age card applicatiobn",
	# 	"triggers" : "Application, Adult Age Card, Adult Proof of Age Card, Proof of Age",
	# 	"url for application" : "http://www.qld.gov.au/transport/licensing/proof-of-age/",
	# 	"required application data (as4590)" : "Birth date, Family name, Given name, Locality Name, Lot Number, Postcode, Road name, Road number 1, Road Type Code, State or Territory Code, Telephone Number"
	# }
	def test_serviceWidgetMapper(self):
		userService = TestUserService('anonymous')
		box = BlackBox(blackboxTests.apiUrl, userService)
		service = box.getServices("application")[0]
		mapper = ServiceWidgetMapper(userService)
		result = mapper.getWidget(service)

	def test_serviceWidgetMapperSomeFields(self):
		userService = TestUserService('somefields')
		box = BlackBox(blackboxTests.apiUrl, userService)
		service = box.getServices("application")[0]
		mapper = ServiceWidgetMapper(userService)
		result = mapper.getWidget(service)

	def test_serviceWidgetMapperAllFields(self):
		userService = TestUserService('allfields')
		box = BlackBox(blackboxTests.apiUrl, userService)
		service = box.getServices("application")[0]
		mapper = ServiceWidgetMapper(userService)
		result = mapper.getWidget(service)

	def test_testWithCamping(self):
		userService = TestUserService('allfields')
		box = BlackBox("http://54.206.52.78/api/views/dnspr.json", userService)
		services = box.getServices("camping")

if __name__ == '__main__':
    unittest.main()