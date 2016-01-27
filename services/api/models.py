from __future__ import unicode_literals
from django.db import models
from tree import Node
from services.settings import DRUPAL_API

from pymongo import MongoClient


import requests
import json

# Drupal Context
class DrupalDataContext:
    responseData = None

    def __init__(self, url):
        self.apiUrl = url

    def getById(self, id):
        r = self.__getJsonResponse__(self.apiUrl, None)
        for n in r:
            if int(n['nid']) == id:
                return self.getNode(n)
        return None

    def getByTitle(self, title):
        r = self.__getJsonResponse__(self.apiUrl, None)
        print r
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

        # check the types
        if n['type'] != None:
            if n['type'] == 'Responses':
                type = 'response'
                if n['responses short'] != None:
                    title = n['responses short']
            if n['type'] == 'Queries':
                type = 'query'
                if n['query short question'] != None:
                    title = n['query short question']
            if n['type'] == 'Services':
                type = 'service'
                if n['customer title'] != None:
                    title = n['customer title']

        # Use the node title
        if len(title) == 0:
            if n['node_title'] != None:
                title = n['node_title']

        node = {
            "pid":pid,
            "id":nid,
            "title":title,
            "type":type
        }

        node['children'] = self.getChildren(node['id'])
        return node

    def getChildren(self, pid):
        r = self.__getJsonResponse__(self.apiUrl, None)
        result = []
        for n in r:
            if n['parent reference'] != None and n['parent reference'] == str(pid):
                result.append(self.getNode(n))
        return result

    def __getJsonResponse__(self, u, d):
        if DrupalDataContext.responseData != None:
            return DrupalDataContext.responseData
        r = requests.get(u, data=d)
        DrupalDataContext.responseData = json.loads(r.text)
        return DrupalDataContext.responseData

class UserMongoContext:
    def __init__(self, server, port):
        self._client = MongoClient(server, port)
        self._db = self._client.nextgensp2

    def get(self, id):
        return self._db.sessions.find_one({"id":id})

    def save(self, record):
        id = record['id']
        if self.get(id) != None:
            self._db.sessions.replace_one({"id":id}, record)
            return
        self._db.sessions.insert(record)

class UserService:
    def __init__(self, context):
        self._context = context

class Handler:
    def __init__(self, context):
        self._context = context

    def getFirstQuery(self, answer):
        for n in answer['children']:
            if n['type'] == 'query':
                return n
        return None

    def __prepareQuery__(self, query):
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

    def getById(self, id):
        return self._context.getById(id)

    def getQuery(self, title):
        query = self._context.getByTitle(title)
        return self.__prepareQuery__(query)

    def submitAnswer(self, id, pid, value):
        answer = None

        # check for the tree node submission
        if id == 0 and pid == 0 and len(value) > 0:
            answer = self._context.getByTitle(value)
            print answer['title'], answer['children']
        else:
            answer = self._context.getById(id)

        query = self.getFirstQuery(answer)
        return self.__prepareQuery__(query)
