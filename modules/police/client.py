#!/usr/bin/env python
import pika
import time
import uuid

class FibonacciRpcClient(object):
    def __init__(self):
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(
                host='localhost'))

        self.channel = self.connection.channel()

        result = self.channel.queue_declare(exclusive=True)
        self.callback_queue = result.method.queue
        self.channel.queue_bind(exchange='nextgensp2',
                   queue=result.method.queue)

        self.channel.basic_consume(self.on_response, no_ack=True,
                                   queue=self.callback_queue)

    def on_response(self, ch, method, props, body):
        self.response = body
        print body

    def call(self, n):
        self.response = None
        self.corr_id = str(uuid.uuid4())
        self.channel.basic_publish(exchange='services',
                                    routing_key='',
                                    properties=pika.BasicProperties(
                                         reply_to = self.callback_queue,
                                         correlation_id = self.corr_id,
                                         ),
                                    body=str(n))

        print(" [x] Awaiting requests")
        self.channel.start_consuming()

fibonacci_rpc = FibonacciRpcClient()

print(" [x] Requesting")
response = fibonacci_rpc.call(30)
