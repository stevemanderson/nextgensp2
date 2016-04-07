#!/usr/bin/env python
import pika
import sys
import time

seconds = sys.argv[1:] or 0



connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='localhost'))

channel = connection.channel()
result = channel.queue_declare(exclusive=True)
channel.queue_bind(exchange='services',
                   queue=result.method.queue)

def fib(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fib(n-1) + fib(n-2)

def on_request(ch, method, props, body):
    print("Sleeping for %r seconds" % seconds)
    time.sleep(int(seconds[0]))

    n = int(body)

    print(" [.] fib(%s)" % n)
    response = fib(n)


    # REPLY BACK TO THE CLIENT
    ch.basic_publish(exchange='nextgensp2',
                     routing_key=props.reply_to,
                     properties=pika.BasicProperties(correlation_id = props.correlation_id),
                     body=str(response))
    ch.basic_ack(delivery_tag = method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(on_request, queue=result.method.queue)

print(" [x] Awaiting requests")
channel.start_consuming()