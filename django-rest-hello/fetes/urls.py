#fetes URL Configuration

from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    url(r'^employees/', include('employees.urls')),
    url(r'^admin/', admin.site.urls),
]
