from models import *
from services.settings import DRUPAL_API, TEMP_FOLDER
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from api.models import Handler, Field, Agency, AgencyAllowedField, UserField
from api.notificationService import *
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
import json
import ast

def createSessionService():
    mc = UserMongoContext('localhost', 27017)
    sqlC = SqlDataContext("nextgensp2", "postgres")
    return SessionService(mc, sqlC)

def createNotificationService():
    sender = HTMLFileCreator(TEMP_FOLDER+'/notificationservicetests_test_send.html')
    return NotificationService(sender)

def createHandler():
    c = DrupalDataContext(DRUPAL_API)
    ns = createNotificationService()
    return Handler(c, createSessionService(), createNotificationService())

@api_view(['GET'])
def tree(request):
    sessionId = request.COOKIES.get('userSession')
    return Response(createHandler().getTree())

@api_view(['GET'])
def tracking(request):
    sessionId = request.COOKIES.get('userSession')
    result = createHandler().getTracking(sessionId)
    return Response(result)

@api_view(['POST'])
def login(request):
    if 'username' not in request.data:
        return Response('User not found', status=404)

    userName = request.data['username']
    user = None

    try:
        user = User.objects.get(username=userName)
    except (ValueError, ObjectDoesNotExist):
        return Response("User not found", status=404)

    return Response({"userId":user.id})

@api_view(['POST'])
def responses(request):
    sessionId = request.COOKIES.get('userSession')
    pid = 0

    id = request.data['id']

    if 'pid' in request.data:
        pid = request.data['pid']

    value = request.data['value']
    store = 'store' in request.data and request.data['store'] == '1'

    result = createHandler().submitAnswer(int(id), int(pid), value, sessionId, store)
    return Response(result)

@api_view(['POST'])
def submitService(request):
    sessionId = request.COOKIES.get('userSession')
    h = createHandler()
    query = None
    service = None

    if 'id' in request.data:
        service = h.getById(int(request.data['id']))
    if 'pid' in request.data:
        query = h.getQueryById(int(request.data['pid']))

    h.addServiceTracking(sessionId, service, query)

    return Response({})

@api_view(['POST'])
def removeService(request):
    sessionId = request.COOKIES.get('userSession')
    h = createHandler()
    queryId = None
    serviceId = None

    if 'id' in request.data:
        serviceId = int(request.data['id'])
    if 'pid' in request.data:
        queryId = int(request.data['pid'])

    h.removeServiceTracking(sessionId, serviceId, queryId)

    return Response({})

@api_view(['POST'])
def multi(request):
    sessionId = request.COOKIES.get('userSession')
    pid = 0

    ids = request.data['ids']

    if 'pid' in request.data:
        pid = request.data['pid']

    result = createHandler().submitAnswers(ids.split(','), int(pid), sessionId)
    return Response(result)


@api_view(['POST'])
def queries(request):
    result = None
    h = createHandler()

    if 'id' in request.data:
        result = h.getQueryById(int(request.data['id']))

    if 'title' in request.data:
        result = h.getQuery(request.data['title'])

    return Response(result)

@api_view(['GET'])
def services(request):
    sessionId = request.COOKIES.get('userSession')
    result = createHandler().getServices(sessionId)
    return Response(result)

@api_view(['GET'])
def fields(request):
    result = []
    for i in Field.objects.all():
        result.append({"name":i.name, "id":i.id})
    return Response(result)

@api_view(['GET'])
def agencies(request):
    result = []
    for i in Agency.objects.all():
        result.append({"name":i.name, "id":i.id})
    return Response(result)

@api_view(['GET'])
def fieldCategories(request):
    result = []
    for i in FieldCategory.objects.all():
        obj = {"name":i.name, "id":i.id, "fields":[]}
        # add all the fields
        for f in i.field_set.all():
            obj['fields'].append({"name":f.name, "id":f.id})
        result.append(obj)
    return Response(result)

@api_view(['GET'])
def allowedAgencyFields(request):
    if 'userId' not in request.GET:
        return Response('User not found', status=404)

    userId = request.GET['userId']
    userAgencyFields = None

    try:
        userAgencyFields = AgencyAllowedField.objects.filter(user_id=userId)
    except (ValueError, ObjectDoesNotExist):
        return Response("Fields not found", status=404)

    result = []
    for f in userAgencyFields:
        result.append(
            {"user_id":f.user_id, "field_id":f.field_id, "fieldName":f.field.name, "agency_id":f.agency_id, "agencyName":f.agency.name})

    return Response(result)

@api_view(['GET'])
def useragencyfields(request):
    if 'userId' not in request.GET:
        return Response('User not found', status=404)
    if 'agencyId' not in request.GET:
        return Response('Agency not found', status=404)

    userId = request.GET['userId']
    agencyId = request.GET['agencyId']

    user = User.objects.get(id=userId)
    allowedFields = user.agencyallowedfield_set.filter(agency_id=agencyId)

    result = {"userId":userId, "fields":[]}

    for allowedField in allowedFields:
        field = allowedField.field
        userField = user.userfield_set.get(field_id=field.id)
        result['fields'].append({
                'id':field.id,
                'name':field.standardMapping,
                'value':userField.value
            })

    return Response(result)

@api_view(['POST', 'GET'])
def useragencies(request):
    if request.method == "POST":
        return post_useragencies(request)
    else:
        return get_useragencies(request)

def post_useragencies(request):
    if 'userId' not in request.data:
        return Response("User not found", status=404)
    if 'agencies' not in request.data:
        return Response("Agencies not found", status=404)

    userId = request.data['userId']
    user = User.objects.get(id=userId)

    agencies = request.data['agencies']

    user.useragency_set.all().delete()
    user.save()

    for agency in agencies:
        # create the agency
        agencyModel = Agency.objects.get(id=agency)
        user.useragency_set.create(user=user, agency=agencyModel)

    return Response("User Agencies updated")

def get_useragencies(request):
    if 'userId' not in request.GET:
        return Response("User not found", status=404)

    userId = request.GET.get('userId')
    user = User.objects.get(id=userId)
    
    result = {"userId":user.id, "agencies":[]}

    for a in user.useragency_set.all():
        agency = a.agency
        result['agencies'].append({"id":agency.id, "name":agency.name})

    return Response(result)

@api_view(['POST', 'GET'])
def userfields(request):
    if request.method == "POST":
        return post_userfields(request)
    else:
        return get_userfields(request)

def post_userfields(request):
    if 'userId' not in request.data:
        return Response("User not found", status=404)
    if 'fields' not in request.data:
        return Response("Fields not found", status=404)

    userId = request.data['userId']
    user = User.objects.get(id=userId)

    fields = request.data.getlist('fields')

    user.userfield_set.all().delete()
    user.save()

    for field in fields:
        fDic = ast.literal_eval(field)

        # delete the field
        user.userfield_set.filter(field_id=fDic['id']).delete()
        user.save()

        # create the field
        fieldModel = Field.objects.get(id=fDic['id'])
        user.userfield_set.create(user=user, field=fieldModel, value=fDic['value'])

    return Response("User updated")

def get_userfields(request):
    if 'userId' not in request.GET:
        return Response("User not found", status=404)

    userId = request.GET.get('userId')
    user = User.objects.get(id=userId)
    
    result = {"userId":user.id, "fields":[]}

    for f in user.userfield_set.all():
        field = f.field
        result['fields'].append({"id":field.id, "name":field.name, "value":f.value})

    return Response(result)

@api_view(['POST'])
def removeUserAgencyField(request):
    if 'userId' not in request.data:
        return Response('User not found', status=404)
    if 'agencyId' not in request.data:
        return Response('Agency not found', status=404)
    if 'fieldId' not in request.data:
        return Response('Field not found', status=404)

    userId = request.data.get('userId')
    agencyId = request.data.get('agencyId')
    fieldId = request.data.get('fieldId')

    AgencyAllowedField.objects.get(user_id=userId, agency_id=agencyId, field_id=fieldId).delete()

    return Response("UserAgencyField removed")

@api_view(['POST'])
def addUserAgencyField(request):
    if 'userId' not in request.data:
        return Response('User not found', status=404)
    if 'agencyId' not in request.data:
        return Response('Agency not found', status=404)
    if 'fieldId' not in request.data:
        return Response('Field not found', status=404)

    userId = request.data.get('userId')
    fieldId = request.data.get('fieldId')
    agencyId = request.data.get('agencyId')

    if AgencyAllowedField.objects.filter(user_id=userId, field_id=fieldId, agency_id=agencyId).exists() == True:
        return Response('Already Exists', status=409)

    AgencyAllowedField.objects.create(user_id=userId, field_id=fieldId, agency_id=agencyId)

    return Response("User Agency Field created")

@api_view(['POST'])
def submitReferral(request):
    sessionId = request.COOKIES.get('userSession')
    return Response({})


# @api_view(['GET'])
# def sessions(request):
#     sessionId = request.COOKIES.get('userSession')
#     result = createHandler().get
