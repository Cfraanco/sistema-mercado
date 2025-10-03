async function cargarInventario() {
    try {
            contenido= `<div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Gestión de Inventario</h2>
            <div>
                <button class="btn btn-success me-2" onclick="nuevoProducto()">
                    <i class="bi bi-plus-circle"></i> Nuevo Producto
                </button>
                <button class="btn btn-primary" onclick="cargarProductos()">
                    <i class="bi bi-arrow-clockwise"></i> Actualizar
                </button>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Stock</th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaProductos">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal Producto -->
        <div class="modal fade" id="modalProducto" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="tituloModalProducto">Nuevo Producto</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formProducto">
                            <input type="hidden" id="productoId">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="productoCodigo" class="form-label">Código *</label>
                                        <input type="text" class="form-control" id="productoCodigo" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="productoNombre" class="form-label">Nombre *</label>
                                        <input type="text" class="form-control" id="productoNombre" required>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="productoDescripcion" class="form-label">Descripción</label>
                                <textarea class="form-control" id="productoDescripcion" rows="3"></textarea>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="productoStock" class="form-label">Stock *</label>
                                        <input type="number" class="form-control" id="productoStock" min="0" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="productoPrecio" class="form-label">Precio *</label>
                                        <input type="number" class="form-control" id="productoPrecio" min="0" step="0.01" required>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarProducto()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>`;
            document.getElementById('contenidoModulo').innerHTML = contenido;
            cargarProductos();
        
    } catch (error) {
        console.error('Error cargando inventario:', error);
        document.getElementById('contenidoModulo').innerHTML = `
            <div class="alert alert-danger">
                <h4>Error</h4>
                <p>No se pudo cargar el módulo de inventario. Verifique que el archivo inventario.html existe en la carpeta ./inventario/</p>
            </div>
        `;
    }
}

async function cargarProductos() {
    try {

        const response = await fetch('http://localhost:8080/api/productos/listar');
         const productos = await response.json();
        
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

function mostrarProductos(productos) {
    const tbody = document.getElementById('tablaProductos');
    tbody.innerHTML = '';
    
    productos.forEach(producto => {
        const estado = producto.stock <= 10 ? 
            '<span class="badge bg-danger">Stock Bajo</span>' : 
            '<span class="badge bg-success">Disponible</span>';
            
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.codigo}</td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion || '-'}</td>
            <td>${producto.stock}</td>
            <td>$${producto.precioUnitario}</td>
            <td>${estado}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editarProducto(${JSON.stringify(producto).replace(/"/g, '&quot;')})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarProducto('${producto.id}', '${producto.nombre.replace(/'/g, "\\'")}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

function nuevoProducto() {
    document.getElementById('tituloModalProducto').textContent = 'Nuevo Producto';
    document.getElementById('formProducto').reset();
    document.getElementById('productoId').value = '';
    const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
    modal.show();
}

function editarProducto(producto) {
    document.getElementById('tituloModalProducto').textContent = 'Editar Producto';
    document.getElementById('productoId').value = producto.id;
    document.getElementById('productoCodigo').value = producto.codigo;
    document.getElementById('productoNombre').value = producto.nombre;
    document.getElementById('productoDescripcion').value = producto.descripcion || '';
    document.getElementById('productoStock').value = producto.stock;
    document.getElementById('productoPrecio').value = producto.precioUnitario;
    
    const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
    modal.show();
}

async function guardarProducto() {
    let id = document.getElementById('productoId').value;
    const productoData = {
        codigo: document.getElementById('productoCodigo').value,
        nombre: document.getElementById('productoNombre').value,
        descripcion: document.getElementById('productoDescripcion').value,
        stock: parseInt(document.getElementById('productoStock').value),
        precioUnitario: parseFloat(document.getElementById('productoPrecio').value)
    };

    try {

        const isEditing = id && id !== '';
        let response;
        
        if (isEditing) {
            response = await fetch(`http://localhost:8080/api/productos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productoData)
            });
        } else {
            response = await fetch('http://localhost:8080/api/productos/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productoData)
            });
        }
        
        if (response.ok) {
            const productoGuardado = await response.json();
            if (isEditing) {
                alert(`Producto actualizado exitosamente: ${productoGuardado.nombre}`);
            } else {
                alert(`Producto creado exitosamente: ${productoGuardado.nombre}`);
            }
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la operación');
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalProducto'));
        modal.hide();
        cargarProductos();
        
    } catch (error) {
        console.error('Error guardando producto:', error);
        alert('Error al guardar el producto');
    }
}

async function eliminarProducto(id, nombre) {
    if (!confirm(`¿Está seguro de eliminar el producto ${nombre}?`)) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/productos/eliminar/${id}`, { 
            method: 'DELETE' 
        });
        
        if (response.ok) {
            alert('Producto eliminado exitosamente');
            cargarProductos();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar el producto');
        }
    } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('Error al eliminar el producto: ' + error.message);
    }
}