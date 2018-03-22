from django.shortcuts import render
from django.http import HttpResponse
#from django.template import loader
from .models import Employee

# Create your views here.
def index(request):

    html = '<h1>Here is the list of your employees</h1>'
    context = {'employees': Employee.objects.all()}
    
    return render(request, 'employees/index.html', context)
    
def detail(request, employee_id):
    return HttpResponse("<h2>Details for employee "+employee_id+"</h2>")