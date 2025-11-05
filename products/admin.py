from django.contrib import admin
from .models import ProductType, Product, Supplier

admin.site.register(ProductType)
admin.site.register(Product)
admin.site.register(Supplier)