from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'responses', views.responses, name='responses'),
    url(r'queries', views.queries, name='queries'),
]
