from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    # Read-only user field (prevents manual user assignment)
    user = serializers.ReadOnlyField(source="user.id")

    # File URL will be returned automatically
    document = serializers.FileField(use_url=True, required=False)

    class Meta:
        model = Product
        fields = "__all__"
