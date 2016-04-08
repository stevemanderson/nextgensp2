import requests
import json

# This is the blackbox for police agency
class BlackBox:
	apiUrl = ""
	responseData = None
	userService = None

	def __init__(self, apiUrl, userService):
		self.apiUrl = apiUrl
		self.responseData = None
		self.userService = userService

	def getServices(self, content):
		

	def getContent(self):
		return self.__getJsonResponse__(self.apiUrl, '')

	def setResponseData(self, content):
		BlackBox.responseData = json.loads(content)

	def __getJsonResponse__(self, u, d):
		if BlackBox.responseData != None:
			return BlackBox.responseData
		r = requests.get(u, data=d)
		self.setResponseData(r.text)
		return BlackBox.responseData
