from django import forms 
from .models import Product

class ProductForm(forms.ModelForm):
    
    class Meta: 
        model = Product 
        fields = ['key', 'name', 'active', 'price', 'product_type']
        labels = {
            'key': 'Clave',
            'name': 'Nombre',
            'active': 'Es Activo',
            'price': 'Precio',
            'product_type': 'Tipo de Producto',
        }

    
class SupplierForm(forms.Form): 
    
    name = forms.CharField(max_length=50, required=True, label='Proveedor')
    description = forms.CharField(max_length=500, required=False, label='Descripción')
    key_supplier = forms.CharField(max_length=50, required=True)
    cost = forms.DecimalField(max_digits=12)