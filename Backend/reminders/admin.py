from django.contrib import admin
from .models import Reminder

@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = (
        "product",
        "user",
        "reminder_date",
        "is_sent",
        "created_at",
    )
    list_filter = ("is_sent", "reminder_date")
    search_fields = ("product__product_name", "user__username")
