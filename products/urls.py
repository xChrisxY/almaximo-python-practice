from django.urls import path 
from . import views

app_name = 'products'

urlpatterns = [
    path('create/', views.CreateProductView.as_view(), name='create-product'),
    path('', views.ListProductsView.as_view(), name='list'),
    path('update/<int:product_id>/', views.UpdateProductView.as_view(), name='update'),
    path('delete/<int:product_id>/', views.DeleteProductView.as_view(), name='delete'),
    path('delete/supplier/<int:supplier_id>/', views.DeleteSupplierView.as_view(), name='delete-supplier'),
    path('finish/', views.FinishProductView.as_view(), name='finish_product')
]
