from django.test import TestCase
from django.test import RequestFactory
from api.views import *
from api.models import Field, Agency, AgencyAllowedField
from django.contrib.auth.models import User

from rest_framework.test import APIRequestFactory

import json

class test_views(TestCase):
	fixtures = ['app.json', 'auth.json']

	def setUp(self):
		self.factory = RequestFactory()

	def test_agencies(self):
		request = self.factory.get('/api/agencies')
		response = agencies(request)
		response.render()

		self.assertTrue(response.status_code == 200)

		# check the first object
		contentObj = json.loads(response.content)
		self.assertTrue(len(contentObj) == 2)

		#check the viewmodel
		self.assertTrue('id' in contentObj[0])
		self.assertTrue('name' in contentObj[0])

	def test_fields(self):
		request = self.factory.get('/api/fields')
		response = fields(request)
		response.render()

		self.assertTrue(response.status_code == 200)
		contentObj = json.loads(response.content)

		#check the viewmodel
		self.assertTrue('id' in contentObj[0])
		self.assertTrue('name' in contentObj[0])

		self.assertTrue(len(contentObj) == 18)

	def test_fieldCategories(self):
		request = self.factory.get('/api/fieldCategories')
		response = fieldCategories(request)
		response.render()

		self.assertTrue(response.status_code == 200)
		contentObj = json.loads(response.content)

		self.assertTrue(len(contentObj) == 5)

		#check the viewmodel
		self.assertTrue('id' in contentObj[0])
		self.assertTrue('name' in contentObj[0])
		self.assertTrue('fields' in contentObj[0])

		#check field
		field = contentObj[0]['fields'][0]
		self.assertTrue('id' in field)
		self.assertTrue('name' in field)

	def test_allowedAgencyFields_NoUserId(self):
		request = self.factory.get('/api/allowedAgencyFields')
		response = allowedAgencyFields(request)
		response.render()

		self.assertTrue(response.status_code == 404)

	def test_allowedAgencyFields(self):
		user = User.objects.get(id=1)
		agency = Agency.objects.get(id=1)
		field = Field.objects.get(id=1)
		allowed = AgencyAllowedField(user=user, agency=agency, field=field)
		allowed.save()

		request = self.factory.get('/api/allowedAgencyFields', {"userId":1})
		response = allowedAgencyFields(request)
		response.render()

		self.assertTrue(response.status_code == 200)

		objContent = json.loads(response.content)

		self.assertTrue('agency_id' in objContent[0])
		self.assertTrue('agencyName' in objContent[0])
		self.assertTrue('user_id' in objContent[0])
		self.assertTrue('field_id' in objContent[0])
		self.assertTrue('fieldName' in objContent[0])

	def test_userfields_post(self):
		user = User.objects.get(id=1)
		field = Field.objects.get(id=1)
		user.userfield_set.create(user=user, field=field, value="Testing")

		request = self.factory.post('/api/userfields', {"userId":1, "fields":[{"id":1,"value":"Testings"}, {"id":2,"value":"teiaoighra"}]})
		response = userfields(request)
		response.render()

		self.assertTrue(response.status_code == 200)

		user = User.objects.get(id=1)
		userFields = user.userfield_set.all()

		self.assertTrue(len(userFields) == 2)
		self.assertTrue(userFields[0].field.id == 1)
		self.assertTrue(userFields[0].value == "Testings")

		user.userfield_set.all().delete()
		user.save()

	def test_userfields_get(self):
		user = User.objects.get(id=1)
		field = Field.objects.get(id=1)
		user.userfield_set.create(user=user, field=field, value="Testing")

		request = self.factory.get('/api/userfields', {"userId":1})
		response = userfields(request)
		response.render()

		self.assertTrue(response.status_code == 200)

		userFields = user.userfield_set.all()
		self.assertTrue(len(userFields) == 1)

		user.userfield_set.all().delete()
		user.save()

	def test_removeAllowedAgencyField_404TestUserId(self):
		user = User.objects.get(id=1)
		field = Field.objects.get(id=1)
		agency = Agency.objects.get(id=1)
		AgencyAllowedField.objects.create(user=user, field=field, agency=agency)

		request = self.factory.post('/api/removeUserAgencyField', {"agencyId":1, "fieldId":1})
		response = removeUserAgencyField(request)
		response.render()

		self.assertTrue(response.status_code == 404)

	def test_removeAllowedAgencyField(self):
		user = User.objects.get(id=1)
		field = Field.objects.get(id=1)
		agency = Agency.objects.get(id=1)
		AgencyAllowedField.objects.create(user=user, field=field, agency=agency)

		request = self.factory.post('/api/removeUserAgencyField', {"userId":1, "agencyId":1, "fieldId":1})
		response = removeUserAgencyField(request)
		response.render()

		self.assertTrue(response.status_code == 200)
		self.assertTrue(len(AgencyAllowedField.objects.all()) == 0)

	def test_useragencies_post(self):
		request = self.factory.post('/api/useragencies', {"userId":1, "agencies":[1]})
		response = useragencies(request)
		response.render()

		self.assertTrue(response.status_code == 200)

		user = User.objects.get(id=1)
		userAgencies = user.useragency_set.all()

		self.assertTrue(len(userAgencies) == 1)
		self.assertTrue(userAgencies[0].agency.id == 1)

		user.useragency_set.all().delete()
		user.save()

	def test_useragencies_get(self):
		user = User.objects.get(id=1)
		agency = Agency.objects.get(id=1)
		user.useragency_set.create(user=user, agency=agency)

		request = self.factory.get('/api/useragencies', {"userId":1})
		response = useragencies(request)
		response.render()

		self.assertTrue(response.status_code == 200)

		user = User.objects.get(id=1)
		userAgencies = user.useragency_set.all()

		self.assertTrue(len(userAgencies) == 1)
		self.assertTrue(userAgencies[0].agency.id == 1)

		user.useragency_set.all().delete()
		user.save()

	def test_useragencyfields_nouser(self):
		request = self.factory.get('/api/useragencyfields', {"userId":0, "agencyId":1})
		response = useragencyfields(request)
		response.render()

		self.assertTrue(response.status_code == 200)

	def test_useragencyfields_correctAgency(self):
		user = User.objects.get(id=1)
		field = Field.objects.get(id=1)
		agency = Agency.objects.get(id=1)

		AgencyAllowedField.objects.create(user=user, field=field, agency=agency)
		UserField.objects.create(user=user, field=field, value="testing this out")

		request = self.factory.get('/api/useragencyfields', {"userId":1, "agencyId":1})
		response = useragencyfields(request)
		response.render()

		self.assertTrue(response.status_code == 200)

		item = json.loads(response.content)
		self.assertTrue(len(item['fields']) == 1)

	def test_useragencyfields_incorrectAgency(self):
		user = User.objects.get(id=1)
		field = Field.objects.get(id=1)
		agency = Agency.objects.get(id=1)

		AgencyAllowedField.objects.create(user=user, field=field, agency=agency)
		UserField.objects.create(user=user, field=field, value="testing this out")

		request = self.factory.get('/api/useragencyfields', {"userId":1, "agencyId":2})
		response = useragencyfields(request)
		response.render()

		self.assertTrue(response.status_code == 200)

		item = json.loads(response.content)
		self.assertTrue(len(item['fields']) == 0)

	def test_addUserAgencyField(self):
		request = self.factory.post('/api/addUserAgencyField', {"userId":1, "agencyId":2, "fieldId":1})
		response = addUserAgencyField(request)
		response.render()

		self.assertTrue(response.status_code == 200)

	def test_addUserAgencyField(self):
		user = User.objects.get(id=1)
		field = Field.objects.get(id=1)
		agency = Agency.objects.get(id=1)

		AgencyAllowedField.objects.create(user=user, field=field, agency=agency)
		UserField.objects.create(user=user, field=field, value="testing this out")

		request = self.factory.post('/api/removeUserAgencyField', {"userId":1, "agencyId":2, "fieldId":1})
		response = addUserAgencyField(request)
		response.render()

		self.assertTrue(response.status_code == 200)

