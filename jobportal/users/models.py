from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import EmailValidator

from email.policy import default
from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)

class Conversation(models.Model):
    members = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    sender_id = models.CharField(max_length=255)
    message = models.TextField()
    message_type = models.CharField(max_length=255, default='text')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



class MyUserManager(BaseUserManager):
    def create_user(self, email, name, password):
        """
        Creates and saves a User with the given email, name  and password.
        """
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(
            email=self.normalize_email(email),
            name=name,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, name, password, description, phone,  username):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            name=name, 
            description=description,
            phone=phone, 
            username=username,
            status="online"            
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    # Add custom fields
    email = models.EmailField(
        verbose_name='Email',
        max_length=255,
        unique=True,
    )
    name = models.CharField(max_length=255)
    password = models.CharField( max_length=255)
    phone = models.IntegerField(default=0)  # Specify a default value suitable for your application
    description = models.TextField(default= "Hey there! I am using WhatsApp")
    username = models.CharField(max_length=255, default="")
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    status = models.CharField(max_length=255, default='offline')

    objects = MyUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name','password']
    def __str__(self):
        return self.email
    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin
    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True
    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


    # Add related_name to avoid clashes with auth.User
    groups = models.ManyToManyField('auth.Group', related_name='custom_user_set')
    user_permissions = models.ManyToManyField('auth.Permission', related_name='custom_user_set')

    # Override save method to hash password before saving
    def save(self, *args, **kwargs):
        if self.password:
            self.set_password(self.password)
        super().save(*args, **kwargs)

    # Override __str__ method for string representation
    def __str__(self):
        return self.username

