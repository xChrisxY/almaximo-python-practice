document.addEventListener('DOMContentLoaded', function() {
    const selectAllCheckbox = document.querySelector('thead input[type="checkbox"]');
    const itemCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            itemCheckboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });
    }

    const deleteModal = document.getElementById('deleteConfirmModal');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const deleteForm = document.getElementById('deleteForm');
    const productNameConfirm = document.getElementById('productNameConfirm');
    const productKeyConfirm = document.getElementById('productKeyConfirm');

    let currentProductId = null;

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product-name');
            const productKey = this.getAttribute('data-product-key');
            
            currentProductId = productId;
            productNameConfirm.textContent = productName;
            productKeyConfirm.textContent = productKey;
            
            deleteForm.action = `/product/delete/${productId}/`;
            
            openDeleteModal();
        });
    });

    function openDeleteModal() {
        deleteModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            deleteModal.querySelector('.bg-white').style.transform = 'scale(1)';
            deleteModal.querySelector('.bg-white').style.opacity = '1';
        }, 10);
    }

    function closeDeleteModal() {
        const modalContent = deleteModal.querySelector('.bg-white');
        modalContent.style.transform = 'scale(0.95)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            deleteModal.style.display = 'none';
            document.body.style.overflow = '';
            currentProductId = null;
        }, 200);
    }

    cancelDeleteBtn.addEventListener('click', closeDeleteModal);

    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && deleteModal.style.display === 'flex') {
            closeDeleteModal();
        }
    });

    deleteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('confirmDeleteBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Eliminando...';
        
        fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar el producto. Intenta de nuevo.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-trash mr-2"></i>Sí, Eliminar';
        });
    });
});