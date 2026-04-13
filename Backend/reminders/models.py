from django.db import models
from django.conf import settings
from products.models import Product


class Reminder(models.Model):
    # User who owns the reminder
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    # Related product
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    # Date when reminder should trigger
    reminder_date = models.DateField()

    # To avoid duplicate notifications
    is_sent = models.BooleanField(default=False)

    # Created timestamp
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.product_name} - {self.reminder_date}"
