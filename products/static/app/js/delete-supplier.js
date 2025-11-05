document.addEventListener('DOMContentLoaded', function() {
    const deleteModal = document.getElementById('deleteSupplierModal');
    const deleteButtons = document.querySelectorAll('.delete-supplier-btn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteSupplierBtn');
    const deleteForm = document.getElementById('deleteSupplierForm');
    const supplierNameConfirm = document.getElementById('supplierNameConfirm');
    const supplierKeyConfirm = document.getElementById('supplierKeyConfirm');
    const supplierCostConfirm = document.getElementById('supplierCostConfirm');
    const deleteProductSupplierId = document.getElementById('deleteProductSupplierId');
    
    // Verificar que todos los elementos existen antes de continuar
    if (!deleteModal || !deleteForm || !cancelDeleteBtn || 
        !supplierNameConfirm || !supplierKeyConfirm || 
        !supplierCostConfirm || !deleteProductSupplierId) {
        console.warn('Modal de eliminación de proveedor no encontrado en el DOM');
        return;
    }

    let currentProductSupplierId = null;

    // Agregar evento click a cada botón de eliminar
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productSupplierId = this.getAttribute('data-product-supplier-id');
            const supplierName = this.getAttribute('data-supplier-name');
            const keySupplier = this.getAttribute('data-key-supplier');
            const cost = this.getAttribute('data-cost');
            
            // Validar que los datos existen
            if (!productSupplierId || !supplierName || !keySupplier || !cost) {
                console.error('Faltan datos del proveedor en el botón');
                return;
            }
            
            currentProductSupplierId = productSupplierId;
            supplierNameConfirm.textContent = supplierName;
            supplierKeyConfirm.textContent = keySupplier;
            supplierCostConfirm.textContent = `$ ${cost}`;
            
            deleteProductSupplierId.value = productSupplierId;
            
            openDeleteModal();
        });
    });

    // Función para abrir el modal
    function openDeleteModal() {
        deleteModal.style.display = 'flex';
        document.body.classList.add('modal-open-delete');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            const modalContent = deleteModal.querySelector('.bg-white');
            if (modalContent) {
                modalContent.style.transform = 'scale(1)';
                modalContent.style.opacity = '1';
            }
        }, 10);
    }

    // Función para cerrar el modal
    function closeDeleteModal() {
        const modalContent = deleteModal.querySelector('.bg-white');
        if (modalContent) {
            modalContent.style.transform = 'scale(0.95)';
            modalContent.style.opacity = '0';
        }
        
        setTimeout(() => {
            deleteModal.style.display = 'none';
            document.body.classList.remove('modal-open-delete');
            document.body.style.overflow = '';
            currentProductSupplierId = null;
            
            // Resetear el formulario
            deleteForm.reset();
        }, 200);
    }

    // Evento para el botón cancelar
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }

    // Cerrar modal al hacer click fuera
    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && deleteModal.style.display === 'flex') {
            closeDeleteModal();
        }
    });

    // Manejar el envío del formulario
    deleteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('confirmDeleteSupplierBtn');
        if (!submitBtn) return;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Eliminando...';
        
        const deleteUrl = `/product/delete/supplier/${currentProductSupplierId}/`;
        
        fetch(deleteUrl, {
            method: 'POST',
            body: new FormData(this),
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (response.ok) {
                // Eliminar la fila de la tabla
                const row = document.querySelector(`tr[data-supplier-id="${currentProductSupplierId}"]`);
                if (row) {
                    row.style.opacity = '0';
                    row.style.transform = 'translateX(-20px)';
                    row.style.transition = 'all 0.3s ease-out';
                    
                    setTimeout(() => {
                        row.remove();
                        
                        // Verificar si quedan proveedores
                        const remainingRows = document.querySelectorAll('#suppliersTableBody tr');
                        if (remainingRows.length === 0) {
                            // Recargar la página para mostrar el mensaje de "no hay proveedores"
                            window.location.reload();
                        }
                    }, 300);
                }
                
                closeDeleteModal();
                
                // Mostrar mensaje de éxito (opcional)
                showSuccessMessage('Proveedor eliminado exitosamente');
            } else if (response.redirected) {
                window.location.href = response.url;
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar el proveedor. Intenta de nuevo.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-trash mr-2"></i>Sí, Eliminar';
        });
    });

    // Función opcional para mostrar mensaje de éxito
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle mr-2"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.opacity = '0';
            successDiv.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => successDiv.remove(), 300);
        }, 3000);
    }
});