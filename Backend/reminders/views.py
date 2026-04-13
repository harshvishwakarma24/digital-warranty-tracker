from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import date

from .models import Reminder
from .serializers import ReminderSerializer
from products.models import Product


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_reminder(request):
    """
    Create a manual reminder
    """
    product_id = request.data.get("product")
    reminder_date = request.data.get("reminder_date")

    try:
        product = Product.objects.get(id=product_id, user=request.user)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

    reminder = Reminder.objects.create(
        user=request.user,
        product=product,
        reminder_date=reminder_date
    )

    serializer = ReminderSerializer(reminder)
    return Response(serializer.data, status=201)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_reminders(request):
    """
    List all reminders for logged-in user
    """
    reminders = Reminder.objects.filter(user=request.user).order_by("reminder_date")
    serializer = ReminderSerializer(reminders, many=True)
    return Response(serializer.data)
