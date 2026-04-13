from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from reminders.utils import create_auto_expiry_reminders
from .serializers import RegisterSerializer, ProfileSerializer

# ✅ ALWAYS use get_user_model with custom user
User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class ProfileView(APIView):
    """
    GET  -> Fetch logged-in user profile
    PUT  -> Update profile details
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):

        #  Auto-create expiry reminders (10 days before)
        create_auto_expiry_reminders()
        
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True   # allows updating only selected fields
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
