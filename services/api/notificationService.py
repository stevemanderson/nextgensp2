import unittest
import smtplib
from ..services.settings import GMAIL_CONFIG

class NotificationService:
    def send(self):
        # get the config file
        f = open(GMAIL_CONFIG, 'r')

        # gmail username
        username = f.readline().strip()
        # gmail password
        password = f.readline().strip()
        # to
        to = f.readline().strip()

        msg = 'I know who you are damien!'

        print 'sending'

        server = smtplib.SMTP('smtp.gmail.com:587')
        server.starttls()
        server.login(username, password)
        server.sendmail(username, to, msg)
        server.quit()

        print 'sent'
