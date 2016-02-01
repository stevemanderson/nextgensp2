from __future__ import unicode_literals
from django.db import models
from services.settings import DRUPAL_API

from api.mappers import *

from pymongo import MongoClient

import requests
import json
import copy

# Drupal Context
class DrupalDataContext:
    responseData = None

    def __init__(self, url):
        self.apiUrl = url

    def getById(self, id, childDepth=100):
        r = self.__getJsonResponse__(self.apiUrl, None)
        for n in r:
            if int(n['nid']) == id:
                return self.getNode(n, childDepth)
        return None

    def getByTitle(self, title, childDepth=100):
        r = self.__getJsonResponse__(self.apiUrl, None)
        for n in r:
            if str(n['node_title']).strip(',. ').lower() == title.lower():
                return self.getNode(n, childDepth)
        return None

    def getNode(self, n, childLevel=100, currentLevel=0):
        node = {}
        DrupalNodeMapper.map(n, node)

        if 'hard_dependency_description' in n and n['hard_dependency_description'] != None:
            node['dependency_description'] = n['hard_dependency_description']

        if 'hard_dependencies' in n and n['hard_dependencies'] != None:
            result = []
            for depId in str(n['hard_dependencies']).split(', '):
                result.append(self.getById(depId, 1))
            node['dependencies'] = result

        if currentLevel < childLevel:
            node['children'] = self.getChildren(node['id'], childLevel, currentLevel)
        else:
            node['children'] = []

        return node

    def getChildren(self, pid, childLevel=100, currentLevel=0):
        currentLevel = currentLevel + 1
        r = self.__getJsonResponse__(self.apiUrl, None)
        result = []
        for n in r:
            if n['parent reference'] != None:
                for parentId in str(n['parent reference']).split(', '):
                    if parentId == str(pid):
                        result.append(self.getNode(n, childLevel, currentLevel))
        return result

    def getQueriesWithNoChildren(self):
        r = self.__getJsonResponse__(self.apiUrl, None)
        queries = filter(lambda x: x['type'] == 'Queries', r)
        results = []
        for q in queries:
            if len(self.getChildren(q['nid'], 1)) == 0:
                results.append(self.getNode(q, 0))
        return results

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

    def get(self, sessionId):
        return self._db.sessions.find_one({"sessionId":sessionId})

    def save(self, sessionId, record):
        if self.get(sessionId) != None:
            self._db.sessions.replace_one({"sessionId":sessionId}, record)
            return
        self._db.sessions.insert(record)

    def delete(self, sessionId):
        self._db.sessions.remove({"sessionId":sessionId})

class SessionService:
    def __init__(self, context):
        self._context = context

    def getSession(self, sessionId):
        return self._context.get(sessionId)

    def sessionExists(self, sessionId):
        return self.getSession(sessionId) != None

    def removeSession(self, sessionId):
        self._context.delete(sessionId)

    def createSession(self, sessionId):
        if self.sessionExists(sessionId):
            return

        session = {
            'sessionId':sessionId
        }
        self._context.save(sessionId, session)

    def getSessionServices(self, sessionId):
        session = self._context.get(sessionId)
        if session == None or 'services' not in session:
            return []
        return session['services']

    def getStoredResponses(self, sessionId):
        session = self._context.get(sessionId)
        if session == None or 'storedResponses' not in session:
            return []
        return session['storedResponses']

    def removeService(self, sessionId, serviceId):
        session = self._context.get(sessionId)
        if 'services' not in session:
            return
        index = -1
        curr = 0
        for i in session['services']:
            if i['id'] == serviceId:
                index = curr
                break
            curr = curr + 1
        del session['services'][index]
        self._context.save(sessionId, session)

    def addService(self, sessionId, service):
        session = self._context.get(sessionId)
        if 'services' not in session:
            session['services'] = []
        found = False
        for i in session['services']:
            if i['id'] == service['id']:
                found = True
                break
        if found != True:
            session['services'].append(service)
        self._context.save(sessionId, session)

    def removeStoredResponse(self, sessionId, answerId):
        session = self._context.get(sessionId)
        if 'storedResponses' not in session:
            return
        index = -1
        curr = 0
        for i in session['storedResponses']:
            if i['id'] == answerId:
                index = curr
                break
            curr = curr + 1
        if index != -1 and index < len(session['storedResponses']):
            del session['storedResponses'][index]
        self._context.save(sessionId, session)

    def addStoredResponse(self, sessionId, answer):
        session = self._context.get(sessionId)
        if 'storedResponses' not in session:
            session['storedResponses'] = []
        found = False
        for i in session['storedResponses']:
            if i['id'] == answer['id']:
                found = True
                break
        if found != True:
            session['storedResponses'].append(answer)
        self._context.save(sessionId, session)

# Facade for the contexts
class Handler:
    def __init__(self, context, sessionService):
        self._context = context
        self._sessionService = sessionService

    def getFirstQuery(self, answer):
        for n in answer['children']:
            if n['type'] == 'query':
                return self._context.getById(n['id'], 1)
        return None

    # levels are not implemented
    def __removeChildLevel__(self, item):
        # only get the first level
        if 'children' in item:
            for c in item['children']:
                if 'children' in c:
                    c.pop('children', None)

    def getSession(self, sessionId):
        return self._sessionService.getSession(sessionId)

    def removeSession(self, sessionId):
        self._sessionService.removeSession(sessionId)

    def getById(self, id, childDepth=1):
        result = self._context.getById(id, childDepth)
        return result

    def getQuery(self, title):
        return self._context.getByTitle(title, 1)

    def getQueryById(self, id):
        return self._context.getById(id, 1)

    def getServices(self, sessionId):
        return self._sessionService.getSessionServices(sessionId)

    def submitAnswers(self, ids, pid, sessionId):
        # store the responses first :|
        if len(ids) > 1:
            for i in range(1, len(ids)):
                response = self._context.getById(int(ids[i]), 1)
                self._sessionService.addStoredResponse(sessionId, response)

        query = self.submitAnswer(int(ids[0]), int(pid), '', sessionId, False)
        return query

    # the pid is not set up
    def submitAnswer(self, id, pid, value, sessionId, storeResponse=False):
        answer = None

        # Create if it doesn't exist
        if self._sessionService.sessionExists(sessionId) != True:
            self._sessionService.createSession(sessionId)

        # check for the tree node submission
        if id == 0 and pid == 0 and len(value) > 0:
            answer = self._context.getByTitle(value)
        else:
            answer = self._context.getById(id)

        query = self.getFirstQuery(answer)

        if query == None:
            return {}

        # check the children and add the services
        for i in query['children']:
            if i['type'] == 'service':
                self._sessionService.addService(sessionId, i)

        # store the response
        if storeResponse:
            # dont store the children
            temp = copy.deepcopy(answer)
            if 'children' in temp:
                temp.pop('children', None)
            self._sessionService.addStoredResponse(sessionId, temp)
        else:
            # remove from the stored if exists
            self._sessionService.removeStoredResponse(sessionId, answer['id'])

        query['storedResponses'] = self._sessionService.getStoredResponses(sessionId)

        return query
