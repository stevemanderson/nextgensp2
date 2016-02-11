from models import *
from services.settings import DRUPAL_API
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from api.models import Handler

@api_view(['GET'])
def tree(request):
    sessionId = request.COOKIES.get('userSession')
    c = DrupalDataContext(DRUPAL_API)
    mc = UserMongoContext('localhost', 27017)
    sqlC = SqlDataContext("nextgensp2", "postgres")
    sc = SessionService(mc, sqlC)
    h = Handler(c, sc)
    return Response(h.getTree())

@api_view(['GET'])
def tracking(request):
    sessionId = request.COOKIES.get('userSession')
    c = DrupalDataContext(DRUPAL_API)
    mc = UserMongoContext('localhost', 27017)
    sqlC = SqlDataContext("nextgensp2", "postgres")
    sc = SessionService(mc, sqlC)
    h = Handler(c, sc)
    result = h.getTracking(sessionId)
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

    c = DrupalDataContext(DRUPAL_API)
    mc = UserMongoContext('localhost', 27017)
    sqlC = SqlDataContext("nextgensp2", "postgres")
    sc = SessionService(mc, sqlC)
    h = Handler(c, sc)

    result = h.submitAnswer(int(id), int(pid), value, sessionId, store)

    return Response(result)

@api_view(['POST'])
def multi(request):
    sessionId = request.COOKIES.get('userSession')
    pid = 0

    # TODO: Update to keep track of users
    if 'pid' in request.data:
        pid = request.data['pid']

    ids = request.data['ids']

    c = DrupalDataContext(DRUPAL_API)
    mc = UserMongoContext('localhost', 27017)
    sqlC = SqlDataContext("nextgensp2", "postgres")
    sc = SessionService(mc, sqlC)
    h = Handler(c, sc)

    result = h.submitAnswers(ids.split(','), int(pid), sessionId)

    return Response(result)


@api_view(['POST'])
def queries(request):
    result = None
    c = DrupalDataContext(DRUPAL_API)
    mc = UserMongoContext('localhost', 27017)
    sqlC = SqlDataContext("nextgensp2", "postgres")
    sc = SessionService(mc, sqlC)
    h = Handler(c, sc)

    if 'id' in request.data:
        result = h.getQueryById(int(request.data['id']))

    if 'title' in request.data:
        result = h.getQuery(request.data['title'])

    return Response(result)

@api_view(['GET'])
def services(request):
    sessionId = request.COOKIES.get('userSession')

    c = DrupalDataContext(DRUPAL_API)
    mc = UserMongoContext('localhost', 27017)
    sqlC = SqlDataContext("nextgensp2", "postgres")
    sc = SessionService(mc, sqlC)
    h = Handler(c, sc)

    result = h.getServices(sessionId)

    return Response(result)
