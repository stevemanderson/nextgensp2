import json
import requests

class UserService:
	responseData = None

	def __init__(self, apiUrl):
		self.apiUrl = apiUrl

	def getUser(self):
		return self.getContent()

	def getContent(self):
		return self.__getJsonResponse__(self.apiUrl, '')

	def __getJsonResponse__(self, u, d):
		r = requests.get(u, data=d)

		UserService.responseData = json.loads(r.text)
		return UserService.responseData