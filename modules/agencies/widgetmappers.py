import json

class AlertWidgetMapper:
	def getWidget(self):
		return {
			"WidgetType":"Alert",
			"WidgetID":0,
			"AgencyID":0,
			"Data": {
				"Title":"9 New Job Matches",
				"SubTitle":"Updated 2m ago"	,
				"ButtonText":"",
				"Footer":"",
				"ReplyToQueue":""
			}
		}

class ServiceWidgetMapper:
	def __init__(self, userService):
		self.userService = userService

	def getWidget(self, service):
		user = self.userService.getUser()

		customFields = []
		as4590Fields = []

		if 'required application data (custom)' in service:
			custom = service['required application data (custom)'] if service['required application data (custom)'] != None else ""
			customFields = map(lambda x: x.strip().lower(), custom.split(','))
			
		if 'required application data (as4590)' in service:
			as4590 = service['required application data (as4590)'] if service['required application data (as4590)'] != None else ""
			as4590Fields = map(lambda x: x.strip().lower(), as4590.split(','))

		fields = customFields + as4590Fields

		userFields = map(lambda x: x.strip().lower(), user['fields'])

		missing = filter(lambda x: x.strip().lower() not in userFields, fields)

		return {
			"WidgetType":"Service",
			"WidgetID":0,
			"AgencyID":0,
			"Data":{
				"Title": service['title'] if 'title' in service else "", 
				"SubTitle": "",
				"ButtonText":"RENEW NOW",
				"Footer": service['suggested action statement'] if 'suggested action statement' in service else "",
				"Url": service['url for application'] if 'url for application' in service else '',
				"ReplyToQueue":"",
				"RequiredFields":fields,
				"MissingFields":missing,
			}
		}