from models import DrupalDataContext
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

@api_view(['POST'])
def responses(request):
    id = request.data['id']
    pid = request.data['pid']
    value = request.data['value']
    return Response('{"pid":'+pid+',"id":'+id+'}')
