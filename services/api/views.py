from models import *
from services.settings import DRUPAL_API
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

from api.models import Handler

@api_view(['POST'])
def responses(request):
    sessionId = request.COOKIES.get('userSession')

    id = request.data['id']
    pid = request.data['pid']
    value = request.data['value']
    store = 'store' in request.data and request.data['store'] == '1'

    c = DrupalDataContext(DRUPAL_API)
    mc = UserMongoContext('localhost', 27017)
    sc = SessionService(mc)
    h = Handler(c, sc)

    result = h.submitAnswer(int(id), int(pid), value, sessionId, store)

    return Response(result)

@api_view(['POST'])
def multi(request):
    sessionId = request.COOKIES.get('userSession')

    pid = request.data['pid']
    ids = request.data['ids']

    c = DrupalDataContext(DRUPAL_API)
    mc = UserMongoContext('localhost', 27017)
    sc = SessionService(mc)
    h = Handler(c, sc)

    result = h.submitAnswers(ids.split(','), int(pid), sessionId)

    return Response(result)


@api_view(['POST'])
def queries(request):
    result = None
    c = DrupalDataContext(DRUPAL_API)
    mc = UserMongoContext('localhost', 27017)
    sc = SessionService(mc)
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
    sc = SessionService(mc)
    h = Handler(c, sc)

    result = h.getServices(sessionId)

    return Response(result)
