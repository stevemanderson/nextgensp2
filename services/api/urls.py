from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'responses', views.responses, name='responses'),
    url(r'queries', views.queries, name='queries'),
    url(r'services', views.services, name='services'),
    url(r'multiresponses', views.multiresponses, name='multiresponses'),
]
