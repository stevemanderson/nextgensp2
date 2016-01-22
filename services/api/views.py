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
    return Response(h.submitAnswer(int(id), int(pid), value))
    #return Response(json.dumps(h.submitAnswer(id, pid, value), lambda o : o.__dict__))
