document.addEventListener('DOMContentLoaded', function () {

    const modal = document.getElementById('supplierModal');
    const openModalBtn = document.getElementById('openModalBtn');
    
    if (openModalBtn) {
        const closeModalBtn = document.getElementById('closeModalBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const supplierForm = document.getElementById('supplierForm');
        const feedbackMessage = document.getElementById('feedbackMessage');

        openModalBtn.addEventListener('click', function() {
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                modal.querySelector('.bg-white').style.transform = 'scale(1)';
                modal.querySelector('.bg-white').style.opacity = '1';
            }, 10);
        });

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
            }, 200);
        }

        closeModalBtn.addEventListener('click', cerrarModal);
        cancelBtn.addEventListener('click', cerrarModal);

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

        supplierForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = document.getElementById('submitSupplierBtn');
            
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
                if (data.success) {
                mostrarMensaje('Proveedor agregado exitosamente', 'success');
                
                if (data.supplier) {
                    agregarProveedorALista(data.supplier);
                }
                
                setTimeout(() => {
                    cerrarModal();
                }, 1000);
                } else {
                mostrarMensaje(data.error || 'Error al guardar el proveedor', 'error');
                }
            })
            .catch(error => {
                mostrarMensaje('Error de conexión. Intenta de nuevo.', 'error');
                console.error('Error:', error);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Guardar';
            });
        });

        function mostrarMensaje(mensaje, tipo) {
            feedbackMessage.textContent = mensaje;
            if (tipo === 'success') {
                feedbackMessage.className = 'mt-4 p-3 rounded-lg bg-green-100 text-green-800 border border-green-200';
            } else {
                feedbackMessage.className = 'mt-4 p-3 rounded-lg bg-red-100 text-red-800 border border-red-200';
            }
            feedbackMessage.style.display = 'block';
        }

        function agregarProveedorALista(proveedor) {
            const lista = document.getElementById('suppliersList');
            
            if (lista.querySelector('p') || lista.querySelector('.text-center')) {
                lista.innerHTML = '<ul class="space-y-3" id="suppliersUl"></ul>';
            }
            
            const ul = lista.querySelector('ul') || lista;
            const li = document.createElement('li');
            li.className = 'bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-150';
            li.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="flex items-center mb-2">
                            <i class="fas fa-truck text-green-500 mr-2"></i>
                            <span class="font-medium text-gray-800">${proveedor.name}</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>
                                <span class="font-medium">Clave proveedor:</span> 
                                <span class="font-mono bg-gray-200 px-1 rounded">${proveedor.key_supplier}</span>
                            </div>
                            <div>
                                <span class="font-medium">Costo:</span> 
                                <span class="text-green-600 font-semibold">$${proveedor.cost}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            ul.appendChild(li);
        }
    }
});
