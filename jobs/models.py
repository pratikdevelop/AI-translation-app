from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Job(models.Model):
    employer = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'employer'})
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=5000)
    location = models.CharField(max_length=255)
    salary_range = models.CharField(max_length=100, blank=True)  # e.g., "$50k-$70k"
    job_type = models.CharField(
        max_length=20,
        choices=(('full_time', 'Full-Time'), ('part_time', 'Part-Time'), ('contract', 'Contract')),
        default='full_time'
    )
    posted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} - {self.employer.company_name}"


class JobApplication(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    job_seeker = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'job_seeker'})
    applied_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=(('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')),
        default='pending'
    )
    cover_letter = models.TextField(max_length=2000, blank=True)

    def __str__(self):
        return f"{self.job_seeker.email} - {self.job.title}"