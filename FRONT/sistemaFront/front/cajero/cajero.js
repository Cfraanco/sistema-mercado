
let carrito = [];
let productoEncontrado = null;

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function () {
        inicializarSistema();

        // buscar producto al presionar Enter
        document.getElementById('codigoProducto').addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                        buscarProducto();
                }
        });
});

function inicializarSistema() {
        // Mostrar información del usuario logueado
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if(!usuario){
                window.location.href = '../login/login.html';
                return;
        }

        const rol = localStorage.getItem('rol');
        document.getElementById('userInfo').textContent = `Usuario: ${usuario.usuario.nombre} Cédula: ${usuario.usuario.cedula}`;

        // Verificar si el usuario tiene permisos de cajero
        if (rol !== "2" && rol !== 2) {
                alert('Acceso denegado. Solo los cajeros pueden acceder a este módulo.');
                logout(true);
                return;
        }
}

async function buscarProducto() {
        const codigo = document.getElementById('codigoProducto').value.trim();

        if (!codigo) {
                alert('Por favor ingrese un código de producto');
                return;
        }

        try {
               
                const response = await fetch(`http://localhost:8080/api/productos/listar?codigo=${codigo}`, {
                        method: 'GET',
                        headers: {
                                'Content-Type': 'application/json',
                        }
                });

                if (response.ok) {
                        const producto = await response.json();
                        mostrarProductoEncontrado(producto);
                } else {
                        alert('Producto no encontrado');
                        limpiarBusqueda();
                }
        } catch (error) {
                console.error('Error al buscar producto:', error);
                alert('Error al buscar producto');
               
        }
}

function mostrarProductoEncontrado(productos) {

        if (!productos) {
                limpiarBusqueda();
                return;
        }

        const lista = Array.isArray(productos) ? productos : [productos];

        if (lista.length === 0) {
                alert('Producto no encontrado');
                limpiarBusqueda();
                return;
        }

        if (lista.length === 1) {
                const producto = lista[0];
                productoEncontrado = producto;
                document.getElementById('nombreProducto').textContent = producto.nombre;
                document.getElementById('descripcion').textContent = producto.descripcion;
                document.getElementById('codigoInfo').textContent = producto.codigo;
                document.getElementById('stockInfo').textContent = producto.stock;
                document.getElementById('precioInfo').textContent = producto.precioUnitario;

                const contExist = document.getElementById('resultadosProductos');
                if (contExist) contExist.remove();

                document.getElementById('productoInfo').style.display = 'block';
                document.getElementById('cantidadProducto').focus();
                return;
        }

        let cont = document.getElementById('resultadosProductos');
        if (cont) cont.remove();

        cont = document.createElement('div');
        cont.id = 'resultadosProductos';
        cont.className = 'mb-3';
        const titulo = document.createElement('label');
        titulo.className = 'form-label';
        titulo.textContent = 'Productos encontrados - seleccione uno:';
        cont.appendChild(titulo);

        const listaEl = document.createElement('div');
        listaEl.className = 'list-group';

        lista.forEach((producto, idx) => {
                const item = document.createElement('div');
                item.className = 'list-group-item d-flex justify-content-between align-items-start';
                item.innerHTML = `
                        <div>
                                <div><strong>${producto.nombre}</strong> (${producto.codigo})</div>
                                <div class="text-muted">${producto.descripcion}</div>
                                <div class="text-small">Stock: ${producto.stock} — Precio: $${producto.precioUnitario}</div>
                        </div>
                `;

                const btn = document.createElement('button');
                btn.className = 'btn btn-sm btn-primary ms-3';
                btn.textContent = 'Seleccionar';
                btn.addEventListener('click', function () {
                        seleccionarProducto(producto);
                });

                item.appendChild(btn);
                listaEl.appendChild(item);
        });

        cont.appendChild(listaEl);

        const productoInfoEl = document.getElementById('productoInfo');
        if (productoInfoEl && productoInfoEl.parentNode) {
                productoInfoEl.parentNode.insertBefore(cont, productoInfoEl);
        } else {
                document.body.insertBefore(cont, document.body.firstChild);
        }

        if (document.getElementById('productoInfo')) {
                document.getElementById('productoInfo').style.display = 'none';
        }
}

function seleccionarProducto(producto) {
        productoEncontrado = producto;
        document.getElementById('nombreProducto').textContent = producto.nombre;
        document.getElementById('descripcion').textContent = producto.descripcion;
        document.getElementById('codigoInfo').textContent = producto.codigo;
        document.getElementById('stockInfo').textContent = producto.stock;
        document.getElementById('precioInfo').textContent = producto.precioUnitario;

        // Mostrar bloque de producto y quitar la lista de resultados
        const cont = document.getElementById('resultadosProductos');
        if (cont) cont.remove();
        const productoInfoEl = document.getElementById('productoInfo');
        if (productoInfoEl) productoInfoEl.style.display = 'block';
        const cantidadEl = document.getElementById('cantidadProducto');
        if (cantidadEl) cantidadEl.focus();
}
function limpiarBusqueda() {
        document.getElementById('codigoProducto').value = '';
        document.getElementById('productoInfo').style.display = 'none';
        productoEncontrado = null;
}

function agregarProducto() {
        if (!productoEncontrado) {
                alert('Primero debe buscar un producto');
                return;
        }

        const cantidad = parseInt(document.getElementById('cantidadProducto').value);

        if (!cantidad || cantidad <= 0) {
                alert('Por favor ingrese una cantidad válida');
                return;
        }

        if (cantidad > productoEncontrado.stock) {
                alert(`Stock insuficiente. Solo hay ${productoEncontrado.stock} unidades disponibles`);
                return;
        }

        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.codigo === productoEncontrado.codigo);

        if (productoExistente) {
                const nuevaCantidad = productoExistente.cantidad + cantidad;
                if (nuevaCantidad > productoEncontrado.stock) {
                        alert(`No puede agregar más productos. Stock máximo: ${productoEncontrado.stock}`);
                        return;
                }
                productoExistente.cantidad = nuevaCantidad;
                productoExistente.total = productoExistente.cantidad * productoExistente.precio;
        } else {
                carrito.push({
                        producto: productoEncontrado.id,
                        codigo: productoEncontrado.codigo,
                        nombre: productoEncontrado.nombre,
                        cantidad: cantidad,
                        precio: productoEncontrado.precioUnitario,
                        total: cantidad * productoEncontrado.precioUnitario
                });
        }

        actualizarCarrito();
        limpiarBusqueda();
        document.getElementById('cantidadProducto').value = 1;
}

function actualizarCarrito() {
        const carritoBody = document.getElementById('carritoBody');

        if (carrito.length === 0) {
                carritoBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay productos en el carrito</td></tr>';
                document.getElementById('btnFinalizar').disabled = true;
        } else {
                carritoBody.innerHTML = '';
                carrito.forEach((item, index) => {
                        const fila = document.createElement('tr');
                        fila.innerHTML = `
                <td>${item.codigo}</td>
                <td>${item.nombre}</td>
                <td>
                    <input type="number" class="form-control form-control-sm" value="${item.cantidad}" 
                           min="1" onchange="cambiarCantidad(${index}, this.value)">
                </td>
                <td>$${item.precio}</td>
                <td>$${item.total}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
                        carritoBody.appendChild(fila);
                });
                document.getElementById('btnFinalizar').disabled = false;
        }

        calcularTotales();
}

function cambiarCantidad(index, nuevaCantidad) {
        const cantidad = parseInt(nuevaCantidad);

        if (!cantidad || cantidad <= 0) {
                alert('Cantidad inválida');
                actualizarCarrito();
                return;
        }

        carrito[index].cantidad = cantidad;
        carrito[index].total = cantidad * carrito[index].precio;
        actualizarCarrito();
}

function eliminarProducto(index) {
        if (confirm('¿Está seguro de eliminar este producto del carrito?')) {
                carrito.splice(index, 1);
                actualizarCarrito();
        }
}

function calcularTotales() {
        const total = carrito.reduce((sum, item) => sum + item.total, 0);

        document.getElementById('totalGeneral').textContent = total;
}

function limpiarCarrito() {
        if (carrito.length === 0) return;

        if (confirm('¿Está seguro de limpiar todo el carrito?')) {
                carrito = [];
                actualizarCarrito();
        }
}

async function finalizarVenta() {
        if (carrito.length === 0) {
                alert('El carrito está vacío');
                return;
        }

        const ventaData = {
                ventaDetalle: carrito.map(item => ({
                        producto: item.producto,
                        cantidadProducto: item.cantidad,
                        precioTotalxProducto: item.total
                })),
                totalVenta: carrito.reduce((sum, item) => sum + item.total, 0)
        };

        try {
                const response = await fetch('http://localhost:8080/api/ventas/crear', {
                        method: 'POST',
                        headers: {
                                'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(ventaData)
                });

                if (response.ok) {
                        const resultado = await response.json();
                        mostrarVentaFinalizada(resultado);
                } else {
                        alert('Error al registrar la venta');
                }
        } catch (error) {
                console.error('Error al finalizar venta:', error);
        }
}

function mostrarVentaFinalizada(resultado) {
        document.getElementById('transaccionFinalizada').textContent = resultado.id;
        document.getElementById('fechaTransaccionFinalizada').textContent = resultado.fecha;
        document.getElementById('totalFinalizado').textContent = resultado.totalVenta;

        const modal = new bootstrap.Modal(document.getElementById('ventaModal'));
        modal.show();
}

async function consultarInventario() {
        try {
          
                const response = await fetch('http://localhost:8080/api/productos/listar', {
                        method: 'GET',
                        headers: {
                                'Content-Type': 'application/json',
                        }
                });

                if (response.ok) {
                        const productos = await response.json();
                        mostrarInventario(productos);
                } else {
                        alert('Error al consultar inventario');
                }
        } catch (error) {
                console.error('Error al consultar inventario:', error);
        }
}

function mostrarInventario(productos) {
        const inventarioBody = document.getElementById('inventarioBody');
        inventarioBody.innerHTML = '';

        productos.forEach(producto => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
            <td>${producto.codigo}</td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.stock}</td>
            <td>$${producto.precioUnitario}</td>
        `;
                inventarioBody.appendChild(fila);
        });

        const modal = new bootstrap.Modal(document.getElementById('inventarioModal'));
        modal.show();
}

function limpiar() {
        carrito = [];
        actualizarCarrito();
        limpiarBusqueda();
        const modal = bootstrap.Modal.getInstance(document.getElementById('ventaModal'));
        modal.hide();
        document.getElementById('codigoProducto').focus();
}

function logout(forzado) {
        if (forzado) {
                localStorage.clear();
                window.location.href = '../login/login.html';
                return;
        } else {
                if (confirm('¿Está seguro de cerrar sesión?')) {
                        localStorage.clear();
                        window.location.href = '../login/login.html';
                }
        }
}
