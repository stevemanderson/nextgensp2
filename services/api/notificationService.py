import unittest
import smtplib
from ..services.settings import SESSION_EMAIL_TEMPLATE
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

class SessionEmailRenderer:
    def __init__(self, tokens, templateFilename):
        self.tokens = tokens
        self.templateFilename = templateFilename

    def renderTokens(self, tokens, template):
        result = template
        for key in tokens.iterkeys():
            result = result.replace("{{"+key+"}}", tokens[key])
        return result

    def render(self):
        template = ""
        with open(self.templateFilename, 'r') as content_file:
            template = content_file.read()
        return self.renderTokens(self.tokens, template)

class GmailSmtpSender:
    def __init__(self, authFilename):
        self.authFilename = authFilename

    def send(self, subject, body):
        f = open(self.authFilename, 'r')
        # gmail username
        username = f.readline().strip()
        # gmail password
        password = f.readline().strip()
        # to user
        to = f.readline().strip()
        f.close()

        msg = MIMEMultipart('alternative')
        msg['Subject'] = "Notification"
        msg['From'] = username
        msg['To'] = to

        msg.attach(MIMEText(body, 'plain'))
        msg.attach(MIMEText(body, 'html'))

        server = smtplib.SMTP('smtp.gmail.com:587')
        server.starttls()
        server.login(username, password)
        server.sendmail(username, to, msg.as_string())
        server.quit()

class NotificationService:
    def __init__(self, sender):
        self.sender = sender

    def send(self):
        renderer = SessionEmailRenderer({'first_name':'Steve', 'last_name':'Anderson'}, SESSION_EMAIL_TEMPLATE)
        
        # put together the body
        self.sender.send("Notification", renderer.render())
