# Working with models

```
class Employee(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    ssn = models.CharField(max_length=15)
    email = models.CharField(max_length=60)

class Department(models.Model):
    name = models.CharField(max_length=20)
    director = models.ForeignKey(Employee, )
```
