from django.conf.urls import url

from . import views

urlpatterns = [
    url('responses', views.responses, name='responses'),
    url('queries', views.queries, name='queries'),
    url('services', views.services, name='services'),
    url('multi', views.multi, name='multi'),
]
