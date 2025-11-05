const modal = document.getElementById('supplierModal');
const modalTitle = document.getElementById('modalTitle');
const formType = document.getElementById('formType');
const productSupplierId = document.getElementById('productSupplierId');
const supplierForm = document.getElementById('supplierForm');
const feedbackMessage = document.getElementById('feedbackMessage');

function abrirModalNuevo() {
    modalTitle.textContent = 'Nuevo Proveedor';
    formType.value = 'supplier';
    productSupplierId.value = '';
    supplierForm.reset();
    abrirModal();
}

document.addEventListener('DOMContentLoaded', function() {
    const openModalBtn = document.getElementById('openModalBtn');
    if (openModalBtn) {
        openModalBtn.addEventListener('click', abrirModalNuevo);
    }
    
    document.querySelectorAll('.edit-supplier-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-product-supplier-id');
            const name = this.getAttribute('data-supplier-name');
            const description = this.getAttribute('data-supplier-description');
            const key_supplier = this.getAttribute('data-key-supplier');
            const cost = this.getAttribute('data-cost');
            
            editarProveedor(id, name, description, key_supplier, cost);
        });
    });
});

// Abrir modal para EDITAR proveedor existente
function editarProveedor(id, name, description, key_supplier, cost) {
    modalTitle.textContent = 'Editar Proveedor';
    formType.value = 'update_supplier';
    productSupplierId.value = id;
    
    document.getElementById('supplier_name').value = name;
    document.getElementById('supplier_description').value = description || '';
    document.getElementById('supplier_key').value = key_supplier;
    document.getElementById('supplier_cost').value = cost;
    
    abrirModal();
}

function abrirModal() {
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        modal.querySelector('.bg-white').style.transform = 'scale(1)';
        modal.querySelector('.bg-white').style.opacity = '1';
    }, 10);
}

function cerrarModal() {
    const modalContent = modal.querySelector('.bg-white');
    modalContent.style.transform = 'scale(0.95)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        supplierForm.reset();
        feedbackMessage.style.display = 'none';
        modalContent.style.transform = 'scale(0.95)';
        modalContent.style.opacity = '0';
    }, 200);
}

document.getElementById('closeModalBtn').addEventListener('click', cerrarModal);
document.getElementById('cancelBtn').addEventListener('click', cerrarModal);

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        cerrarModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        cerrarModal();
    }
});

// Enviar formulario
supplierForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const submitBtn = document.getElementById('submitSupplierBtn');
    const isUpdate = formType.value === 'update_supplier';
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';
    
    fetch(window.location.href, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta:', data);
        
        if (data.success) {
            mostrarMensaje(
                isUpdate ? 'Proveedor actualizado exitosamente' : 'Proveedor agregado exitosamente', 
                'success'
            );
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            mostrarMensaje(data.error || 'Error al guardar', 'error');
        }
    })
    .catch(error => {
        mostrarMensaje('Error de conexión', 'error');
        console.error('Error:', error);
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar';
    });
});

function mostrarMensaje(mensaje, tipo) {
    feedbackMessage.textContent = mensaje;
    feedbackMessage.className = tipo === 'success' 
        ? 'mt-4 p-3 rounded-lg bg-green-100 text-green-800 border border-green-200'
        : 'mt-4 p-3 rounded-lg bg-red-100 text-red-800 border border-red-200';
    feedbackMessage.style.display = 'block';
}