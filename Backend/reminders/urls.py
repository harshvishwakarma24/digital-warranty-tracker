from django.urls import path
from .views import create_reminder, list_reminders

urlpatterns = [
    path("", list_reminders),
    path("create/", create_reminder),
]
