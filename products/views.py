from django.shortcuts import render, redirect, get_object_or_404
from django.views import View
from django.http import JsonResponse
from django.db.models import Q
from .models import Product, Supplier, ProductSupplier
from .forms import ProductForm, SupplierForm

class CreateProductView(View): 
    
    template_name = 'create_product.html'

    def get(self, request):

        product_id = request.session.get('current_product_id')
        product = None

        if product_id:
            product = get_object_or_404(Product, id=product_id)
        
        form = ProductForm()
        supplier_form = SupplierForm()
        return render(request, self.template_name, {
            'form': form, 'supplier_form': supplier_form, 'product': product
        })

    def post(self, request):
        
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        form_type = request.POST.get('form_type')

        if form_type == 'product':
            form = ProductForm(request.POST)

            if form.is_valid():
                new_product = form.save()
                request.session['current_product_id'] = new_product.id

                return redirect('products:create-product')
            
            else: 
                errors = form.errors.get_json_data()
                return render(request, self.template_name, {
                    'form': form, 
                    'supplier_form': form
                })

        elif form_type == 'supplier': 
            
            supplier_form = SupplierForm(request.POST)
            product_id = request.session.get('current_product_id')

            if not product_id: 
                return JsonResponse({
                    'success': False, 
                    'error': 'Debes crear el producto primero.'
                }, status=400)

            product = get_object_or_404(Product, id=product_id)

            if supplier_form.is_valid(): 

                try: 
                    name = supplier_form.cleaned_data['name']
                    description = supplier_form.cleaned_data['description']
                    key_supplier = supplier_form.cleaned_data['key_supplier']
                    cost = supplier_form.cleaned_data['cost']

                    supplier, created = Supplier.objects.get_or_create(
                        name=name, 
                        defaults={'description': description}
                    )

                    product_supplier, ps_created = ProductSupplier.objects.get_or_create(
                        product=product, 
                        supplier=supplier, 
                        defaults={'key_supplier': key_supplier, 'cost': cost}
                    )

                    if not ps_created:
                        product_supplier.key_supplier = key_supplier
                        product_supplier.cost = cost
                        product_supplier.save()

                    return JsonResponse({
                        'success': True, 
                        'supplier': {
                            'id': supplier.id, 
                            'name': supplier.name, 
                            'key_supplier': key_supplier, 
                            'cost': str(cost)
                        }
                    })

                except Exception as e: 
                    print("Error al guardar proveedor:", str(e))
                    return JsonResponse({
                        'success': False,
                        'error': f'Error al guardar: {str(e)}'
                    }, status=500)

            else:                
                return JsonResponse({
                    'success': False,
                    'error': f'Datos inválidos'
                }, status=400)


        return JsonResponse({
            'success': False,
            'error': 'Solicitud inválida'
        }, status=400)

class ListProductsView(View):
    
    template_name = 'list_products.html'

    def get(self, request): 
        products = Product.objects.all()

        return render(request, self.template_name, {
            'products': products
        })        
            
    def post(self, request): 
        
        key = request.POST.get('key')
        product_type = request.POST.get('product_type')

        products = Product.objects.all()

        if key or product_type: 
            products = products.filter(
                Q(key__icontains=key) & Q(product_type__name__icontains=product_type)
            )

            return render(request, self.template_name, {
                'products': products
            })

        return render(request, self.template_name, {
            'products': products
        })        
        
    
class UpdateProductView(View): 
    
    template_name = 'product_detail.html'

    def get(self, request, product_id: int): 

        product = get_object_or_404(Product, pk=product_id)
        product_suppliers = ProductSupplier.objects.filter(product=product).select_related('supplier')
        form = ProductForm(instance=product)
        supplier_form = SupplierForm()

        return render(request, self.template_name, {
            'form': form,
            'product': product, 
            'suppliers': product_suppliers, 
            'supplier_form': supplier_form
        })

    def post(self, request, product_id):
        
        form_type = request.POST.get('form_type')
        product = get_object_or_404(Product, pk=product_id)
        product_suppliers = ProductSupplier.objects.filter(product=product).select_related('supplier')

        if form_type == 'product':
            form = ProductForm(request.POST, instance=product)
            if form.is_valid():
                try:
                    print("mskdjsd")
                    form.save()
                    return redirect('products:list')
                except ValueError:
                    return render(request, self.template_name, {
                        'form': form, 
                        'errors': 'Por favor proporciona los campos del formulario.'
                    })
            else: 
                errors = form.errors.get_json_data()
                return render(request, self.template_name, {
                    'form': form, 
                    'product': product,
                    'suppliers': product_suppliers
                })

        if form_type == 'supplier':
            
            supplier_form = SupplierForm(request.POST)
            if supplier_form.is_valid():
                
                try: 
                    name = supplier_form.cleaned_data['name']
                    description = supplier_form.cleaned_data['description']
                    key_supplier = supplier_form.cleaned_data['key_supplier']
                    cost = supplier_form.cleaned_data['cost']

                    supplier, created = Supplier.objects.get_or_create(
                        name=name, 
                        defaults={'description': description}
                    )

                    product_supplier, ps_created = ProductSupplier.objects.get_or_create(
                        product=product, 
                        supplier=supplier, 
                        defaults={'key_supplier': key_supplier, 'cost': cost}
                    )

                    if not ps_created:
                        product_supplier.key_supplier = key_supplier
                        product_supplier.cost = cost
                        product_supplier.save()

                    return JsonResponse({
                        'success': True, 
                        'supplier': {
                            'id': supplier.id, 
                            'name': supplier.name, 
                            'key_supplier': key_supplier, 
                            'cost': str(cost)
                        }
                    })

                except Exception as e: 
                    print("Error al guardar proveedor:", str(e))
                    return JsonResponse({
                        'success': False,
                        'error': f'Error al guardar: {str(e)}'
                    }, status=500)

            else:                
                return JsonResponse({
                    'success': False,
                    'error': f'Datos inválidos'
                }, status=400)

        if form_type == 'update_supplier': 
            product_supplier_id = request.POST.get('product_supplier_id')
            
            if not product_supplier_id:
                return JsonResponse({
                    'success': False,
                    'error': 'ID del proveedor no proporcionado'
                }, status=400)
            
            try:
                product_supplier = get_object_or_404(ProductSupplier, id=product_supplier_id, product=product)
                supplier_form = SupplierForm(request.POST)
                
                if supplier_form.is_valid():
                    name = supplier_form.cleaned_data['name']
                    description = supplier_form.cleaned_data['description']
                    key_supplier = supplier_form.cleaned_data['key_supplier']
                    cost = supplier_form.cleaned_data['cost']
                    
                    # Actualizar el proveedor
                    supplier = product_supplier.supplier
                    supplier.name = name
                    supplier.description = description
                    supplier.save()
                    
                    # Actualizar ProductSupplier
                    product_supplier.key_supplier = key_supplier
                    product_supplier.cost = cost
                    product_supplier.save()
                    
                    return JsonResponse({
                        'success': True,
                        'supplier': {
                            'id': supplier.id,
                            'name': supplier.name,
                            'description': supplier.description,
                            'key_supplier': key_supplier,
                            'cost': str(cost),
                            'product_supplier_id': product_supplier.id
                        }
                    })

                else:
                    errors = ', '.join([f"{field}: {error[0]}" for field, error in supplier_form.errors.items()])
                    return JsonResponse({
                        'success': False,
                        'error': f'Datos inválidos: {errors}'
                    }, status=400)
                    
            except Exception as e:
                print(f"Error al actualizar proveedor: {str(e)}")
                return JsonResponse({
                    'success': False,
                    'error': f'Error al actualizar: {str(e)}'
                }, status=500)


        return JsonResponse({
            'success': False,
            'error': 'Solicitud inválida'
        }, status=400)

class DeleteProductView(View): 
    
    def post(self, request, product_id): 

        product = get_object_or_404(Product, pk=product_id)
        if product:
            product.delete()
            return redirect('products:list')
        
class DeleteSupplierView(View): 
    
    def post(self, request, supplier_id):

        try:
            
            product_supplier = get_object_or_404(ProductSupplier, id=supplier_id)
            product_supplier.delete()
        
            return JsonResponse({
                'success': True, 
                'message': 'Proveedor eliminaado exitosamente'
            })

        except Exception as e: 
            return JsonResponse({
                'success': False, 
                'Error': f'Error al eliminar el proveedor: {str(e)}'
            })
        
                
class FinishProductView(View): 
    
    def post(self, request): 
        
        if 'current_product_id' in request.session: 
            del request.session['current_product_id']

            return redirect('products:list')

        return redirect('products:list')