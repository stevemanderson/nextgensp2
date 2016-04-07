from django.conf.urls import url

from . import views

urlpatterns = [
    url('removeUserAgencyField', views.removeUserAgencyField, name='removeUserAgencyField'),
    url('addUserAgencyField', views.addUserAgencyField, name='addUserAgencyField'),
    url('fields', views.fields, name='fields'),
    url('login', views.login, name='login'),
    url('responses', views.responses, name='responses'),
    url('queries', views.queries, name='queries'),
    url('services', views.services, name='services'),
    url('fieldCategories', views.fieldCategories, name='fieldCategories'),
    url('allowedAgencyFields', views.allowedAgencyFields, name='allowedAgencyFields'),
    url('multi', views.multi, name='multi'),
    url('userfields', views.userfields, name='userfields'),
    url('get_userfields', views.get_userfields, name='userfields'),
    url('tracking', views.tracking, name='tracking'),
    url('tree', views.tree, name='tree'),
    url('submitService', views.submitService, name='submitService'),
    url('removeService', views.removeService, name='removeService'),
]
