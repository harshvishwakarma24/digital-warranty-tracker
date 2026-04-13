from rest_framework import viewsets, permissions, parsers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import date, timedelta
from .models import Product
from .serializers import ProductSerializer
from reminders.models import Reminder
from django.db.models import Q
from reminders.serializers import ReminderSerializer

class ProductViewSet(viewsets.ModelViewSet):
    """
    Handles:
    - Add product
    - List products
    - View product details
    - Update product
    - Delete product
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Enables JSON + form-data + file uploads
    parser_classes = (
        parsers.JSONParser,
        parsers.MultiPartParser,
        parsers.FormParser,
    )

    def get_queryset(self):
        # Return only products of logged-in user
        return Product.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically attach logged-in user
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        return {"request": self.request}


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def expiring_soon_products(request):
    """
    Returns products expiring within the next 10 days
    """
    today = date.today()
    next_10_days = today + timedelta(days=10)

    products = Product.objects.filter(
        user=request.user,
        warranty_expiry_date__gte=today,
        warranty_expiry_date__lte=next_10_days
    )

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def expired_products(request):
    """
    Returns products that are already expired
    """
    today = date.today()

    products = Product.objects.filter(
        user=request.user,
        warranty_expiry_date__lt=today
    )

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    today = date.today()
    next_10_days = today + timedelta(days=10)

    total_products = Product.objects.filter(user=request.user).count()

    expiring_soon = Product.objects.filter(
        user=request.user,
        warranty_expiry_date__gte=today,
        warranty_expiry_date__lte=next_10_days
    ).count()

    expired = Product.objects.filter(
        user=request.user,
        warranty_expiry_date__lt=today
    ).count()

    reminders_count = Reminder.objects.filter(
        user=request.user
    ).count()

    bills_count = Product.objects.filter(
        user=request.user
    ).exclude(
        Q(document__isnull=True) | Q(document="")
    ).count()

    # ✅ Recently added products (1)
    recent_product  = Product.objects.filter(
        user=request.user
    ).order_by("-created_at").first()

    recent_product_data = (
        ProductSerializer(
            recent_product,
            context={"request": request}
    ).data
    if recent_product else None
)
    latest_reminders = Reminder.objects.filter(
        user=request.user,
        reminder_date__gte=today
    ).order_by("reminder_date")[:2]   # use 2 (as you wanted)

    latest_reminders_data = ReminderSerializer(
        latest_reminders,
        many=True
    ).data
    return Response({
        "total_products": total_products,
        "expiring_soon": expiring_soon,
        "expired": expired,
        "reminders": reminders_count,
        "bills": bills_count,
        "recent_product": recent_product_data,
        "latest_reminders": latest_reminders_data,

    })
