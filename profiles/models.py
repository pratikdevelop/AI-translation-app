# profiles/models.py
from django.db import models
from django.core.validators import URLValidator

class Experience(models.Model):
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'job_seeker'},
        related_name='experiences'
    )
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(max_length=2000, blank=True)
    is_current = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} at {self.company} - {self.user.email}"

    class Meta:
        ordering = ['-start_date']

class Education(models.Model):
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'job_seeker'},
        related_name='educations'
    )
    degree = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(max_length=2000, blank=True)
    is_current = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.degree} from {self.institution} - {self.user.email}"

    class Meta:
        ordering = ['-start_date']

class Portfolio(models.Model):
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='portfolios'  # Access via user.portfolios.all()
    )
    name = models.CharField(max_length=100)  # e.g., "GitHub", "GitLab", "Behance"
    url = models.URLField(validators=[URLValidator()])  # e.g., "https://github.com/user"

    def __str__(self):
        return f"{self.name}: {self.url} - {self.user.email}"

    class Meta:
        verbose_name = "Portfolio"
        verbose_name_plural = "Portfolios"
        unique_together = ('user', 'url')  # Prevent duplicate URLs per user

class Address(models.Model):
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='addresses'  # Access via user.addresses.all()
    )
    street = models.CharField(max_length=255, blank=True)  # e.g., "123 Main St"
    city = models.CharField(max_length=100, blank=True)    # e.g., "New York"
    state = models.CharField(max_length=100, blank=True)   # e.g., "NY"
    zip_code = models.CharField(max_length=20, blank=True) # e.g., "10001"
    country = models.CharField(max_length=100, blank=True) # e.g., "USA"
    address_type = models.CharField(
        max_length=20,
        choices=(
            ('home', 'Home'),
            ('work', 'Work'),
            ('other', 'Other'),
        ),
        default='home'
    )
    is_primary = models.BooleanField(default=False)  # Flag for main address

    def __str__(self):
        return f"{self.street}, {self.city}, {self.state} {self.zip_code} - {self.user.email}"

    class Meta:
        verbose_name = "Address"
        verbose_name_plural = "Addresses"
        unique_together = ('user', 'street', 'city')  # Prevent duplicate addresses per user