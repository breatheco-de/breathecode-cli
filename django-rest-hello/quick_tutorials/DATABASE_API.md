# django database API

To start first type:

```
$ python manage.py shell
```

That will start the python database API

Import the models you want to work with:
```
from [your_application_name].models import [Model1], [Model2]
```
Print all departments (supposing you have a departmen Model)
```
Department.objects.all()
```
Create a department (supposing you have a departmen Model)
```
dep = Department(name='My First Department')
```
Filtering departments (supposing you have a departmen Model)
```
Department.objects.filter(id=1)
Department.objects.filter(name__startswith='Ac')
Department.objects.get(id=1)
```

Get relation
```
dep.employee_set.all()
```
Set relation
```
dep = Department()
em2.department = dep

dep.employee_set.create() #emproyee parameters
```
