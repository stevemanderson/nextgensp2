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
def multiresponses(request):
    #sessionId = request.COOKIES.get('userSession')
    return Response({})

    pid = request.data['pid']
    ids = request.data['ids']

    c = DrupalDataContext(DRUPAL_API)
    mc = UserMongoContext('localhost', 27017)
    sc = SessionService(mc)
    h = Handler(c, sc)

    result = h.submitAnswers(ids, int(pid), sessionId)

    return Response(result)


@api_view(['POST'])
def queries(request):
    title = request.data['title']
    c = DrupalDataContext(DRUPAL_API)
    mc = UserMongoContext('localhost', 27017)
    sc = SessionService(mc)
    h = Handler(c, sc)
    result = h.getQuery(title)
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
