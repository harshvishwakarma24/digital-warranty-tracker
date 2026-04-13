from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator


class Product(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    product_name = models.CharField(max_length=100)
    purchase_date = models.DateField()
    warranty_expiry_date = models.DateField()

    auto_reminder_created = models.BooleanField(default=False)

    # Allow only image or PDF documents
    document = models.FileField(
        upload_to="documents/",
        null=True,
        blank=True,
        validators=[
            FileExtensionValidator(
                allowed_extensions=['jpg', 'jpeg', 'png', 'pdf']
            )
        ]
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product_name