import unittest
from ..api.notificationService import *

class SessionEmailRendererTests(unittest.TestCase):
    service = SessionEmailRenderer({"first_name":"Steve", "last_name":"Anderson"}, "/home/steve/Projects/nextgensp2/services/templates/test_template.html")

    def test_bindTokenTest(self):
        template = "<html>{{first_name}} {{last_name}}</html>"
        tokens = {"first_name":"Steve", "last_name":"Anderson"}
        output = SessionEmailRendererTests.service.renderTokens(tokens, template)
        self.assertTrue(output == "<html>Steve Anderson</html>")

if __name__ == '__main__':
    unittest.main()
