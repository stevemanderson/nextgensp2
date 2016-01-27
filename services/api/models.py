from __future__ import unicode_literals
from django.db import models
from tree import Node
from services.settings import DRUPAL_API

import requests
import json

# Drupal Context
class DrupalDataContext:
    responseData = None

    def __init__(self, url):
        self.apiUrl = url

    def getById(self, id):
        r = self.getJsonResponse(self.apiUrl, None)
        for n in r:
            if int(n['nid']) == id:
                return self.getNode(n)
        return None

    def getByTitle(self, title):
        r = self.getJsonResponse(self.apiUrl, None)
        for n in r:
            if str(n['node_title']).strip(',. ').lower() == title.lower():
                return self.getNode(n)
        return None

    def getNode(self, n):
        pid = 0
        nid = 0
        title = ""
        type = ""

        if n['parent reference'] != None: pid = int(n['parent reference'])
        if n['nid'] != None: nid = int(n['nid'])
        if n['node_title'] != None: title = n['node_title']

        if n['type'] != None:
            if n['type'] == 'Responses': type = 'response'
            if n['type'] == 'Queries': type = 'query'
            if n['type'] == 'Services': type = 'service'

        node = {
            "pid":pid,
            "id":nid,
            "title":title,
            "type":type
        }

        node['children'] = self.getChildren(node['id'])
        return node

    def getChildren(self, pid):
        r = self.getJsonResponse(self.apiUrl, None)
        result = []
        for n in r:
            if n['parent reference'] != None and n['parent reference'] == str(pid):
                result.append(self.getNode(n))
        return result

    def getJsonResponse(self, u, d):
        if DrupalDataContext.responseData != None:
            return DrupalDataContext.responseData
        r = requests.get(u, data=d)
        DrupalDataContext.responseData = json.loads(r.text)
        return DrupalDataContext.responseData

class Handler:
    def getFirstQuery(self, answer):
        for n in answer['children']:
            if n['type'] == 'query':
                return n
        return None

    def prepareQuery(self, query):
        result = {}
        if query == None: return result

        result['id'] = query['id']
        result['title'] = query['title']
        result['children'] = []

        for n in query['children']:
            obj = {}
            obj['id'] = n['id']
            obj['title'] = n['title']
            obj['type'] = n['type']
            result['children'].append(obj)

        return result

    def getQuery(self, title):
        context = DrupalDataContext(DRUPAL_API)
        query = context.getByTitle(title)
        return self.prepareQuery(query)

    def submitAnswer(self, id, pid, value):
        context = DrupalDataContext(DRUPAL_API)
        answer = None

        # check for the tree node submission
        if id == 0 and pid == 0 and len(value) > 0:
            answer = context.getByTitle(value)
            print answer['title'], answer['children']
        else:
            answer = context.getById(id)

        query = self.getFirstQuery(answer)
        return self.prepareQuery(query)