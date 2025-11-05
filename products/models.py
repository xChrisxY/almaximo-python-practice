from django.db import models

class ProductType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, max_length=255)

    def __str__(self):
        return self.name

class Supplier(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, max_length=255)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Product(models.Model): 
    key = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=50)
    active = models.BooleanField(default=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    product_type = models.ForeignKey(ProductType, on_delete=models.CASCADE, related_name="products")
    suppliers = models.ManyToManyField(Supplier, through="ProductSupplier", related_name="products")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self): 
        return f"{self.key} - {self.name}"

class ProductSupplier(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    key_supplier = models.CharField(max_length=50)
    cost = models.DecimalField(max_digits=12, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('product', 'supplier')

    def __str__(self): 
        return f"{self.supplier.name}"