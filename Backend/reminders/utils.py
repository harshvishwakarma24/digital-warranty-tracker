from datetime import date, timedelta
from products.models import Product
from .models import Reminder


def create_auto_expiry_reminders():
    """
    Automatically create reminders 10 days before warranty expiry
    """
    today = date.today()
    target_date = today + timedelta(days=10)

    products = Product.objects.filter(
        warranty_expiry_date=target_date,
        auto_reminder_created=False
    )

    for product in products:
        Reminder.objects.create(
            user=product.user,
            product=product,
            reminder_date=today
        )

        product.auto_reminder_created = True
        product.save()
