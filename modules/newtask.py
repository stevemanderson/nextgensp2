import sys
import pika
from services import MessageService 

message = ' '.join(sys.argv[1:]) or "Hello World!"
service = MessageService('localhost', 'nextgensp2')
service.send(message, 'dashboard.initial')

print(" [x] Sent %r" % message)