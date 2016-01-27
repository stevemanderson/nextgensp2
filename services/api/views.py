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

    h = Handler()
    result = h.submitAnswer(int(id), int(pid), value))
    return Response(result)

@api_view(['GET'])
def queries(request):
    title = request.data['title']
    h = Handler()
    result = h.getQuery(title)
    return Response(result)
