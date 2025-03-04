from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator, URLValidator
# Create your models here.
class Company(models.Model):
    name = models.CharField(max_length=255)
    website = models.URLField(validators=[URLValidator()], blank=True)
    description = models.TextField(max_length=2000, blank=True)
    logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'employer'})

    def __str__(self):
        return self.name