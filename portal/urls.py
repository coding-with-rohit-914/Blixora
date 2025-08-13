from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    SimulationListView,
    SimulationDetailView,
    EnrollmentListView,
    AdminSimulationManagement,
    UserDashboardView
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('simulations/', SimulationListView.as_view(), name='simulation-list'),
    path('simulations/<int:pk>/', SimulationDetailView.as_view(), name='simulation-detail'),
    path('enrollments/', EnrollmentListView.as_view(), name='enrollment-list'),
    path('admin/simulations/<int:pk>/', AdminSimulationManagement.as_view(), name='admin-simulation'),
    path('dashboard/', UserDashboardView.as_view(), name='user-dashboard'),
]