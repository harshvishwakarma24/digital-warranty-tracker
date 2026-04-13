from rest_framework import serializers
from .models import Reminder


class ReminderSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.product_name")

    class Meta:
        model = Reminder
        fields = "__all__"
        read_only_fields = ["user", "is_sent", "created_at"]
