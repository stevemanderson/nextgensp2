from django.conf.urls import url

from . import views

urlpatterns = [
    url('addUserAgencyField', views.addUserAgencyField, name='addUserAgencyField'),
    url('fields', views.fields, name='fields'),
    url('login', views.login, name='login'),
    url('responses', views.responses, name='responses'),
    url('queries', views.queries, name='queries'),
    url('services', views.services, name='services'),
    url('multi', views.multi, name='multi'),
    url('tracking', views.tracking, name='tracking'),
    url('tree', views.tree, name='tree'),
    url('submitService', views.submitService, name='submitService'),
    url('removeService', views.removeService, name='removeService'),
]
