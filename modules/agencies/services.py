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
		if UserService.responseData != None:
			return UserService.responseData

		r = requests.get(u, data=d)

		print("response: %r" %r)
		UserService.responseData = json.loads(r.text)
		return UserService.responseData