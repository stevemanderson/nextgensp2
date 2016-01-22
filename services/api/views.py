from models import DrupalDataContext
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

@api_view(['POST'])
def responses(request):
    pid = request.data['pid']
    id = request.data['id']
    aid = request.data['aid']
    return Response('{"pid":'+pid+',"id":'+id+',"aid":'+aid+'}')
