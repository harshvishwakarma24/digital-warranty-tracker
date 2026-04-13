from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, expiring_soon_products, expired_products, dashboard_stats

router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="products")

urlpatterns = [
    path("", include(router.urls)),
    path("expiring-soon/", expiring_soon_products),
    path("expired/", expired_products),
    path("dashboard/", dashboard_stats),

]
