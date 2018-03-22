
## Let's start by creating a superuser for the admin (if you have not already):

```sh
$ python manage.py createsuperuser
```
**Note: And answer the questions that the command line will ask you (username, email & password)**

Now you can login to the /admin

## Adding more models to the admin:

Add the following to the employees/admin.py file
```python
admin.site.register(Employee)
```
