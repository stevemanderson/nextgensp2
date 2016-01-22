from __future__ import unicode_literals
from django.db import models
from tree import Node

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
