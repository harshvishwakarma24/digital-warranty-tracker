from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "product_name",
        "user",
        "purchase_date",
        "warranty_expiry_date",
        "auto_reminder_created",
        "created_at",
    )
    search_fields = ("product_name", "user__username")
    list_filter = ("auto_reminder_created", "warranty_expiry_date")
