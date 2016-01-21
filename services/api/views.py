import json
from services.settings import DRUPAL_API
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from models import QueryContext, DrupalQueryContext

def index(request):
    data = {
        "title":"Some tree",
        "answers": [
            {"title":"some answer"}
        ]
    }
    return JsonResponse(data)

def queries(request):
    context = DrupalQueryContext(DRUPAL_API)
    data = context.getRootQuery()
    return JsonResponse(data)

def responses(request):
    return JsonResponse({'title':'Testing'})
