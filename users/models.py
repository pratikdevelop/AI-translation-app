# users/models.py
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.core.validators import RegexValidator, URLValidator

class MyUserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        user = self.create_user(
            email=email,
            name=name,
            password=password,
            is_admin=True,
            role='admin'
        )
        return user

class User(AbstractBaseUser):
    ROLE_CHOICES = (
        ('job_seeker', 'Job Seeker'),
        ('employer', 'Employer'),
        ('admin', 'Admin'),
    )
    STATUS_CHOICES = (
        ('online', 'Online'),
        ('offline', 'Offline'),
    )
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
        ('P', 'Prefer not to say'),
    )

    email = models.EmailField(verbose_name='Email', max_length=255, unique=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(
        max_length=15,
        validators=[RegexValidator(r'^[0-9+()-]*$', 'Enter a valid phone number')],
        blank=True
    )
    username = models.CharField(max_length=150, blank=True, unique=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='offline')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='job_seeker')
    description = models.TextField(max_length=2000, blank=True)

    date_of_birth = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='P')

    # Job seeker fields
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    linkedin_url = models.URLField(validators=[URLValidator()], blank=True)
    
    # Employer fields
    company_name = models.CharField(max_length=255, blank=True)
    company_website = models.URLField(validators=[URLValidator()], blank=True)
    company_description = models.TextField(max_length=2000, blank=True)

    # Platform-specific fields
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    email_verified = models.BooleanField(default=False)
    onboarding_complete = models.BooleanField(default=False)
    
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin

    @property
    def is_staff(self):
        return self.is_admin

    groups = models.ManyToManyField('auth.Group', related_name='custom_user_groups')
    user_permissions = models.ManyToManyField('auth.Permission', related_name='custom_user_permissions')