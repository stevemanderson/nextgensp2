import json
from services.settings import DRUPAL_API
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from models import DrupalDataContext

def index(request):
    data = {
        "title":"Some tree",
        "answers": [
            {"title":"some answer"}
        ]
    }
    return JsonResponse(data)

def responses(request):
    return JsonResponse({'title':'something else'})
