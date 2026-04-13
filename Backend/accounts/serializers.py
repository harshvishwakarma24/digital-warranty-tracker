from rest_framework import serializers
from django.contrib.auth import get_user_model

# ALWAYS use get_user_model when using custom user
User = get_user_model()


# 🔹 Registration serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


# Profile serializer
class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing & updating user profile
    """

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'profile_image',
        ]
        read_only_fields = ['id', 'username', 'email']
