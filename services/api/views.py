from models import *
from services.settings import DRUPAL_API
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from api.models import Handler

def createSessionService():
    mc = UserMongoContext('localhost', 27017)
    sqlC = SqlDataContext("nextgensp2", "postgres")
    return SessionService(mc, sqlC)

def createHandler():
    c = DrupalDataContext(DRUPAL_API)
    return Handler(c, createSessionService())

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
