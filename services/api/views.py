import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

def index(request):
    data = {
        "title":"Some tree",
        "answers": [
            {"title":"some answer"}
        ]
    }
    return JsonResponse(data)
