from django.contrib import admin
# Register our users models here.
from .models import User

admin.site.register(User)
