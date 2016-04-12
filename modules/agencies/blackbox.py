import requests
import json
from services import *
from widgetmappers import *

# This is the blackbox for police agency
class BlackBox:
	responseData = None

	def __init__(self, apiUrl, userServiceApi):
		self.apiUrl = apiUrl
		self.userServiceApi = userServiceApi
		self.responseData = None

	def getServices(self, content):
		wordSplit = map(lambda x: x.lower(), content.split())

		words = []
		index = 0

		for i in range(0, len(wordSplit) + 1):
			for j in range(i, len(wordSplit) + 1):
				words.append(' '.join(wordSplit[i:j]))

		services = []

		for i in self.getContent():
			triggers = map(lambda x: x.strip().lower(), i['triggers'].split(','))
			related = filter(lambda x: x in triggers, words)

			if len(related) > 0:
				services.append(i)

		return services

	def getWidgets(self, content):
		widgets = []
		alertMapper = AlertWidgetMapper()

		widgets.append(alertMapper.getWidget())	

		#get all the services
		serviceMapper = ServiceWidgetMapper(UserService(self.userServiceApi))
		for service in self.getServices(content):
			widgets.append(serviceMapper.getWidget(service))

		return widgets

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
