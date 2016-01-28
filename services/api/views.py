from models import DrupalDataContext
from services.settings import DRUPAL_API
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

from api.models import Handler

@api_view(['POST'])
def responses(request):
    id = request.data['id']
    pid = request.data['pid']
    value = request.data['value']

    c = DrupalDataContext(DRUPAL_API)
    h = Handler(c)
    result = h.submitAnswer(int(id), int(pid), value, 1)
    return Response(result)

@api_view(['POST'])
def queries(request):
    title = request.data['title']
    c = DrupalDataContext(DRUPAL_API)
    h = Handler(c)
    result = h.getQuery(title)
    return Response(result)
