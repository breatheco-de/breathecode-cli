from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=25)
    
    def __str__(self):
        return self.name + 'Hello'
    #director = models.ForeignKey(Employee)
    
# Create your models here.
class Employee(models.Model):
    department = models.ForeignKey(Department) #on_delete=models.CASCADE
    first_name = models.CharField(max_length=25)
    last_name = models.CharField(max_length=25)
    ssn = models.CharField(max_length=15)
    address = models.CharField(max_length=250)
    email = models.CharField(max_length=100)
    
    
    