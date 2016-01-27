from api.models import *
from api.tree import *
from services.settings import *
import json

result = h.getQuery('What type of business?')
result = h.submitAnswer(23, 34, '')
print result

n = Node(1, 'Something', 'node')
n2 = Node(2, 'Something else', 'eh')
n.addNode(n2)
t = Tree.withParams(0, 'testing', n)
output = json.dumps(t, default=lambda o: o.__dict__)
t2 = Tree()
t2.__dict__ = json.loads(output)

print type(t2.root)
