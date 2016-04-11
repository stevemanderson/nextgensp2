import json

class AlertWidgetMapper:
	def getWidget(self):
		return {
			"WidgetType":"Alert",
			"WidgetID":0,
			"Data": {
				"Title":"9 New Job Matches",
				"SubTitle":"Updated 2m ago"	,
				"ButtonText":"",
				"Footer":"",
				"AgencyID":"1",
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
			customFields = map(lambda x: x.strip().lower(), service["required application data (custom)"].split(','))
		if 'required application data (as4590)' in service:
			as4590Fields = map(lambda x: x.strip().lower(), service["required application data (as4590)"].split(','))

		fields = customFields + as4590Fields
		userFields = map(lambda x: x.strip().lower(), json.loads(user)['fields'])

		missing = filter(lambda x: x.strip().lower() not in userFields, fields)

		return {
			"WidgetType":"Service",
			"WidgetID":0,
			"Data":{
				"Title": service['title'] or "", 
				"SubTitle": "",
				"ButtonText":"RENEW NOW",
				"Footer": service['suggested_action_statement'] or "",
				"Url": service['url_for_application'] or '',
				"AgencyID":"1",
				"ReplyToQueue":"",
				"RequiredFields":fields,
				"MissingFields":missing,
			}
		}