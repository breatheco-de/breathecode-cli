
1. Install django-oauth-toolkit
```
$ pip install django-oauth-toolkit
```

2. You need to ave at least these apps on settings.py

```
INSTALLED_APPS = (
    'django.contrib.admin',
    ...
    'oauth2_provider',
    'rest_framework',
)
```
3. Add the autentication class to the REST_FRAMEWORK
```
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    )
}

OAUTH2_PROVIDER = {
    # this is the list of available scopes
    'SCOPES': {'read': 'Read scope', 'write': 'Write scope', 'groups': 'Access to your groups'}
}
```

4. Import the classes on your views and use them as you wish.

from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope

5. Create the app on your django admin

Make sure you set the app token type to 


## If you encounter a django.http.request.RawPostDataException

Its because the oAuth framework ads a middleware that checks your Request Body on every request, this will probably fix it.

```
REST_FRAMEWORK = {
    ...
    'FORM_METHOD_OVERRIDE': None,
    'FORM_CONTENT_OVERRIDE': None,
    'FORM_CONTENTTYPE_OVERRIDE': None
    }
```
