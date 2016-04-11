#!/usr/bin/env python
import pika
import sys
import time
import json
from blackbox import BlackBox

connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='localhost'))

channel = connection.channel()
result = channel.queue_declare(exclusive=True)
channel.queue_bind(exchange='services',
                   queue=result.method.queue)

def getServices(body):
    box = BlackBox("http://mstrong.info/api/views/dtmr_personalised_service.json")
    print box.getWidgets(body)
    return json.dumps(box.getWidgets(body))

def reply(ch, method, props, body):
    ch.basic_publish(exchange='nextgensp2',
                     routing_key=props.reply_to,
                     properties=pika.BasicProperties(correlation_id = props.correlation_id),
                     body=str(body))
    ch.basic_ack(delivery_tag = method.delivery_tag)

    
def on_request(ch, method, props, body):
    response = getServices(body)

    # REPLY BACK TO THE CLIENT
    reply(ch, method, props, response) 

    
channel.basic_qos(prefetch_count=1)
channel.basic_consume(on_request, queue=result.method.queue)

print(" [x] Awaiting requests")
channel.start_consuming()