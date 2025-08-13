from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

# class User(AbstractUser):
#     ROLE_CHOICES = (
#         ('user', 'User'),
#         ('admin', 'Admin'),
#     )
#     role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    
#     class Meta:
#         db_table = 'users'

class User(AbstractUser):
    class Role(models.TextChoices):
        USER = 'user', _('User')
        ADMIN = 'admin', _('Admin')
    
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.USER
    )
    
    # Add related_name to avoid clashes
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        help_text=_('The groups this user belongs to.'),
        related_name="blixora_user_groups",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="blixora_user_permissions",
        related_query_name="user",
    )
    
    class Meta:
        db_table = 'users'

class Simulation(models.Model):
    DIFFICULTY_CHOICES = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    )
    
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    duration = models.IntegerField(help_text="Duration in minutes")
    description = models.TextField()
    
    class Meta:
        db_table = 'simulations'

class Enrollment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    simulation = models.ForeignKey(Simulation, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    progress = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'enrollments'
        unique_together = ('user', 'simulation')