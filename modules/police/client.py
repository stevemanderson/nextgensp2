#!/usr/bin/env python

from services import MessageService
import json

service = MessageService('localhost', 'nextgensp2')

def callback(ch, method, properties, body):
	routingKey = method.routing_key
	print(" [x] Routing %r" % routingKey)
	print(" [x] Received %r" % body)

	if routingKey == 'dashboard.initial':
		print " [x] Loading dashboard"

if __name__ == "__main__":
	service.recv(callback)
