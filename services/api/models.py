from __future__ import unicode_literals
from django.db import models
from mappers import *
from pymongo import MongoClient
import psycopg2

import requests
import json
import copy
import datetime

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

        if currentLevel < childLevel:
            temp = self.getChildren(node['id'], childLevel, currentLevel)
            children = []
            ids = []

            for c in temp:
                if c['id'] not in ids:
                    ids.append(c['id'])
                    children.append(c)

            node['children'] = children
        else:
            node['children'] = []
        return node


    def getChildren(self, pid, childLevel=100, currentLevel=0):
        currentLevel = currentLevel + 1
        r = self.__getJsonResponse__(self.apiUrl, None)
        result = []

        # TODO: update these loops, they are O(n)^2 :|
        for n in r:
            if n['parent reference'] != None:
                for parentId in str(n['parent reference']).split(', '):
                    if parentId == str(pid):
                        newNode = self.getNode(n, childLevel, currentLevel)
                        newNode['pid'] = pid
                        result.append(newNode)
        return result

    def getQueriesWithResponseAndQueries(self):
        r = self.__getJsonResponse__(self.apiUrl, None)
        queries = filter(lambda x: x['type'] == 'Queries', r)
        results = []
        for q in queries:
            hasService = False
            hasResponse = False
            for c in self.getChildren(q['nid'], 1):
                if c['type'] == 'Responses':
                    hasResponse = True
                if c['type'] == 'Services':
                    hasService = True
            if hasService and hasResponse:
                results.append(self.getNode(q, 1))
        return results

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

class SqlDataContext:
    def __init__(self, dbName, user):
        self._dbName = dbName
        self._user = user

    def mapTrackingAggregate(self, obj):
        return {
            'queryId':obj[0],
            'selectionId':obj[1],
            'count':obj[2],
        }

    def mapTracking(self, obj):
        return {
            'query_title':obj[0],
            'selection_title':obj[1]
        }

    def addTracking(self, sessionId, record):
        conn = psycopg2.connect("dbname={0} user={1}".format(self._dbName, self._user))
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO tracking (session_id, query_id, selection_id, type, date, selection_title, query_title)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
            """, (
            sessionId,
            record['query']['id'],
            record['selection']['id'],
            record['selection']['type'],
            datetime.datetime.utcnow(),
            record['selection']['title'],
            record['query']['title']))
        conn.commit()
        cur.close()
        conn.close()

    def getTracking(self, sessionId):
        query = """
            select  query_title, selection_title
            from    tracking
            where   type = 'response' and sessionId = '{0}'
            order by date
        """.format(sessionId)

        conn = psycopg2.connect("dbname={0} user={1}".format(self._dbName, self._user))
        cur = conn.cursor()
        cur.execute(query)

        result = []
        for i in cur.fetchall():
            result.append(self.mapTracking(i))

        conn.commit()
        cur.close()
        conn.close()
        return result

    def getTrackingAggregateQuery(self, where):
        query = """
            select query_title, selection_title, query_id, selection_id, count(query_id)
            from tracking
            where {0}
            group by query_id, query_title, selection_id, selection_title
            order by count(query_id) desc
        """.format(where)
        return query

    def getTrackingAggregate(self, type, sessionId=None):
        query = "type = '{0}'".format(type)

        if sessionId is not None:
            query = "{0} and sessionId = '{1}'".format(query, sessionId)

        conn = psycopg2.connect("dbname={0} user={1}".format(self._dbName, self._user))
        cur = conn.cursor()
        cur.execute(self.getTrackingAggregateQuery(query))

        result = []
        for i in cur.fetchall():
            result.append(self.mapTrackingAggregate(i))

        conn.commit()
        cur.close()
        conn.close()
        return result

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
    def __init__(self, context, sqlContext):
        self._context = context
        self._sqlContext = sqlContext

    def addTracking(self, sessionId, selection, parentQuery):
        session = self.getSession(sessionId)
        if session == None:
            raise ValueError("Could not find session")

        if 'tracking' not in session:
            session['tracking'] = []

        tempSelection = copy.deepcopy(selection)
        if 'children' in tempSelection:
            tempSelection.pop('children', None)

        tempQuery = copy.deepcopy(parentQuery)
        if 'children' in tempQuery:
            tempQuery.pop('children', None)

        tracking = {
            'date':datetime.datetime.utcnow(),
            'query':tempQuery,
            'selection':tempSelection
        }

        session['tracking'].append(tracking)
        self._sqlContext.addTracking(sessionId, tracking)
        self._context.save(sessionId, session)

    def getTracking(self, sessionId):
        session = self.getSession(sessionId)
        if session == None or 'tracking' not in session:
            return {}
        return session['tracking']

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
            'date':datetime.datetime.utcnow(),
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
            if i['id'] == service['id'] and i['pid'] == service['pid']:
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

    def getTree(self):
        return self._context.getById(287, 100)

    def getTracking(self, sessionId):
        return self._sessionService.getTracking(sessionId)

    def getSession(self, sessionId):
        return self._sessionService.getSession(sessionId)

    def removeSession(self, sessionId):
        self._sessionService.removeSession(sessionId)

    def getById(self, id, childDepth=1):
        result = self._context.getById(id, childDepth)
        return result

    def getQuery(self, title):
        return self._context.getByTitle(title, 1)

    def getQueryById(self, id, childDepth=1):
        return self._context.getById(id, childDepth)

    def getServices(self, sessionId):
        # return self._sqlContext.getTrackingAggregate('service', sessionId)
        return self._sessionService.getSessionServices(sessionId)

    def submitAnswers(self, ids, pid, sessionId):
        # store the responses first :|
        if len(ids) > 1:
            for i in range(1, len(ids)):
                response = self._context.getById(int(ids[i]), 1)
                self._sessionService.addStoredResponse(sessionId, response)

        query = self.submitAnswer(int(ids[0]), int(pid), '', sessionId, False)

        return query

    def sendNotification(self, name, phoneNo, referrerName, referrerPhoneNo, sessionId, serviceId):
        session = self._sessionService.getSession(sessionId)
        items = self._sqlContext.getTracking(sessionId)

    def addServiceTracking(self, sessionId, service):
        if i['actionable'] == True:
            self._sessionService.addService(sessionId, i)
            self._sessionService.addTracking(sessionId, i, query)

    def submitAnswer(self, id, pid, value, sessionId, storeResponse=False):
        answer = None
        parentQuery = self.getQueryById(pid, 0)

        # Create if it doesn't exist
        if self._sessionService.sessionExists(sessionId) != True:
            self._sessionService.createSession(sessionId)

        # check for the tree node submission
        if id == 0 and pid == 0 and len(value) > 0:
            answer = self._context.getByTitle(value, 1)
        else:
            answer = self._context.getById(id, 1)

        # Track the answer
        self._sessionService.addTracking(sessionId, answer, parentQuery)

        query = self.getFirstQuery(answer)

        if query == None:
            return {}

        # check the children and add the services
        for i in query['children']:
            if i['type'] == 'service':
                self.addServiceTracking(sessionId, i)

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
