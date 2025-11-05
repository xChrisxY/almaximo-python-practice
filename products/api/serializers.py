from rest_framework import serializers
from ..models import Product, ProductType, Supplier, ProductSupplier

class ProductTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductType
        fields = ['id', 'name', 'description']

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'description', 'active', 'created_at']

class ProductSupplierSerializer(serializers.ModelSerializer):
    supplier = SupplierSerializer(read_only=True)
    
    class Meta:
        model = ProductSupplier
        fields = ['id', 'supplier', 'key_supplier', 'cost', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    product_type = ProductTypeSerializer(read_only=True)
    product_type_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductType.objects.all(), 
        source='product_type', 
        write_only=True
    )
    
    suppliers = SupplierSerializer(many=True, read_only=True)
    
    product_suppliers = ProductSupplierSerializer(
        source='productsupplier_set', 
        many=True, 
        read_only=True
    )
    
    class Meta:
        model = Product
        fields = [
            'id', 'key', 'name', 'active', 'price', 
            'product_type', 'product_type_id',
            'suppliers', 'product_suppliers',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']