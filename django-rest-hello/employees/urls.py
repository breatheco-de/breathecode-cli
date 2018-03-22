from django.conf.urls import url
from . import views

urlpatterns = [
    
    # /employee/
    url(r'^$', views.index, name='index'),
    # /employee/{id}
    url(r'^(?P<employee_id>[0-9]+)/$', views.detail, name='detail'),
]