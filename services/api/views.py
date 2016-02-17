from models import *
from services.settings import DRUPAL_API, TEMP_FOLDER
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from api.models import Handler
from api.notificationService import *

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

@api_view(['POST'])
def submitReferral(request):
    sessionId = request.COOKIES.get('userSession')
    return Response({})

# @api_view(['GET'])
# def sessions(request):
#     sessionId = request.COOKIES.get('userSession')
#     result = createHandler().get
