import pika

class MessageService:
	host = ""
	exchange = ""

	def __init__(self, host, exchange):
		self.host = host
		self.exchange = exchange

	def send(self, message, routing_key=''):
		connection = pika.BlockingConnection(pika.ConnectionParameters(
               self.host))
		channel = connection.channel()
		channel.basic_publish(exchange=self.exchange,
                      routing_key=routing_key,
                      body=message)
		connection.close()

	def recv(self, callback):
		connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.host))

		channel = connection.channel()

		channel.exchange_declare(exchange=self.exchange,
                         type='fanout')

		result = channel.queue_declare(exclusive=True)
		queue_name = result.method.queue

		channel.queue_bind(exchange=self.exchange, queue=result.method.queue)

		channel.basic_consume(callback,
                      queue=queue_name,
                      no_ack=True)

		channel.start_consuming()