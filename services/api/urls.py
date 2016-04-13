from django.conf.urls import url

from . import views

urlpatterns = [
    url('useragencyfields', views.useragencyfields),
    url('userfields', views.userfields),
    url('removeUserAgencyField', views.removeUserAgencyField),
    url('addUserAgencyField', views.addUserAgencyField),
    url('useragencies', views.useragencies),
    url('agencies', views.agencies),
    url('fields', views.fields),
    url('login', views.login),
    url('responses', views.responses),
    url('queries', views.queries),
    url('services', views.services),
    url('fieldCategories', views.fieldCategories),
    url('allowedAgencyFields', views.allowedAgencyFields),
    url('multi', views.multi),
    url('tracking', views.tracking),
    url('tree', views.tree),
    url('submitService', views.submitService),
    url('removeService', views.removeService),
]
