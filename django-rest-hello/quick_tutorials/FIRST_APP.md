# Coding a typical CRUD operation


1) Update the <app1_name>/urls.py to include your new URL for the particular expected request

```python
from django.urls import include, path
from . import views

urlpatterns = [
    path('games/', views.GamesView.as_view(), name='games'),
]
```

2) Create the serializer that will handle the JSON conversion
```python
from rest_framework import serializers
from .models import Game

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ('id','player1','player2','winner')
```
3) Create the Model
```python
from django.db import models

# Create your models here.
class Game(models.Model):
    player1 = models.CharField(max_length=20)
    player2 = models.CharField(max_length=20)
    winner = models.CharField(max_length=20)
```

4) Create and execute the migrations
```
$ python manage.py makemigrations tictactoeAPI

$ python manage.py migrate

```

5) Create the APIView class inside the <app1_name>/view.py file

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Game
from .serializable import GameSerializer

class GamesView(APIView):
    def get(self, request):
        games = Game.objects.all()
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data)
```

6) Test your call using [Postman](https://www.getpostman.com/)
