# Playing with the urls.py

To use variabels
```python
url(r'^(?P<employee_id>[0-9]+)$', views.index, name='index'),
```