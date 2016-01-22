from __future__ import unicode_literals
from django.db import models
from tree import Tree, Node

import requests
import json

def object_decoder(obj):
    if 'type' in obj:
        if obj['type'] == 'tree':
            return Tree(obj['id'], obj['title'], obj['root'])
        elif obj['type'] == 'query' or obj['type'] == 'response':
            n = Node(obj['pid'], obj['id'], obj['title'], obj['type'])
            for i in obj['children']:
                n.addNode(i)
            return n
    return obj

def outputLeafs(t):
    for i in t.getLeafNodes():
        print i.title

def getTree():
    tree = '''{
        "id":0,
        "title":"Business",
        "type":"tree",
        "root": {
            "pid":0,
            "id":1,
            "title":"What type of business",
            "type":"query",
            "children":[
                {
                    "pid":1,
                    "id":2,
                    "title":"Cafe as business",
                    "type":"response",
                    "children":[
                        {
                            "pid":2,
                            "id":3,
                            "title":"Cafe operational considerations",
                            "type":"query",
                            "children":[]
                        }
                    ]
                },
                {
                    "pid":1,
                    "id":4,
                    "title":"Cart as business",
                    "type":"response",
                    "children":[]
                }
            ]
        }
    }'''
    return json.loads(tree, object_hook=object_decoder)

class QueryResult:
    def __init__(self):
        self.id = 0
        self.title = ""

class ResponseResult:
    def __init__(self):
        self.id = 0
        self.title = ""

class QueryContext:
    def getQuery(self, id):
        return {
            "id":1,
            "title":"Testing the query",
            "answers":[]
        }
    def getRootQuery(self):
        return {
            "id":0,
            "title":"This is the root",
            "answers": []
        }

class ResponseContext:
    def getAnswer(self, id):
        return {
            "id":1,
            "title":"This si the title of the answer",
            "children":[]
        }

# Drupal Context
class DrupalQueryContext:
    def __init__(self, url):
        self.apiUrl = url
    def getQuery(self, id):
        return {}
    def getRootQuery(self):
        return getJsonResponse(self.apiUrl, None)

class DrupalResponseContext:
    def getAnswer(self, id):
        return {}

def getResponse(u, d):
    r = requests.get(u, data=d)
    return r.text

def getJsonResponse(u, d):
    r = requests.get(u, data=d)
    return json.loads(r.text)
