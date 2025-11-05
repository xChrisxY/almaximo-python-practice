from django.urls import path, include 
from rest_framework.routers import DefaultRouter 
from . import views

app_name = 'api'
router = DefaultRouter()

router.register('', views.ProductViewSet, basename='product')
router.register('supplier', views.SupplierViewSet, basename='supplier')

urlpatterns = [
    path('', include(router.urls))
]
