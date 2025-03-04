from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator, URLValidator
class Dream(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    output = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    analysis = models.JSONField(null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)  # For generated images

    def __str__(self):
        return f"{self.user.username}'s dream at {self.created_at}"





