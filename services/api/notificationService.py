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
        template = self.renderTokens(self.tokens, template)
        return template

class GmailSmtpSender:
    def __init__(self, authFilename):
        self.authFilename = authFilename

    def send(self, to, subject, body):
        f = open(self.authFilename, 'r')
        # gmail username
        username = f.readline().strip()
        # gmail password
        password = f.readline().strip()
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

class HTMLFileCreator:
    def __init__(self, filename):
        self.filename = filename

    def send(self, to, subject, body):
        f = open(self.filename, 'w')
        f.write(body)
        f.close()

class NotificationService:
    def __init__(self, sender):
        self.sender = sender

    # to is an email address
    # model needs name, phone_no, referrer_name and referrer_phone_no
    def send(self, to, model):
        if 'name' not in model:
            raise ValueError('name is missing from dictionary')
        if 'phone_no' not in model:
            raise ValueError('phone no. is missing from dictionary')
        if 'referrer_name' not in model:
            raise ValueError('referrer name is missing from dictionary')
        if 'referrer_phone_no' not in model:
            raise ValueError('referrer phone no. is missing from dictionary')

        # Not sure if this is really needed. The sender would have to be able to handle the html...
        renderer = SessionEmailRenderer(model, SESSION_EMAIL_TEMPLATE)
        self.sender.send(to, "Notification", renderer.render())
