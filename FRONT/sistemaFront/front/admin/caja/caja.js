
async function obtenerEstadisticasCaja() {
    try {
        const hoy = new Date().toLocaleDateString('en-CA');
        const reporteRequest = {
            fechaInicial: hoy,
            fechaFinal: hoy
        };
        
        console.debug('obtenerEstadisticasCaja -> request', reporteRequest);

        const response = await fetch('http://localhost:8080/api/reportes/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reporteRequest)
        });
        
        if (response.ok) {
            const resultado = await response.json();
            console.debug('obtenerEstadisticasCaja -> response', resultado);
 
            const totalIngresos = resultado.totalIngresos ?? resultado.total ?? resultado.totalVentas ?? 0;
            const numeroTransacciones = resultado.numeroTransacciones ?? resultado.totalTransacciones ?? (Array.isArray(resultado.ventas) ? resultado.ventas.length : 0) ?? 0;
            const promedioVenta = numeroTransacciones > 0 ? Math.round(totalIngresos / numeroTransacciones) : 0;

            return {
                totalVentas: totalIngresos,
                numeroTransacciones: numeroTransacciones,
                promedioVenta: promedioVenta
            };
        } else {
            console.error('Error al obtener estadísticas de caja');
            return null;
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        return null;
    }
}

async function obtenerTransacciones() {
    try {
        
        const hoy = new Date().toLocaleDateString('en-CA');
        const reporteRequest = {
            fechaInicial: hoy,
            fechaFinal: hoy
        };

        console.debug('obtenerTransacciones -> request', reporteRequest);

        const response = await fetch('http://localhost:8080/api/reportes/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reporteRequest)
        });

        if (response.ok) {
            const resultado = await response.json();
            console.debug('obtenerTransacciones -> response', resultado);
            if (Array.isArray(resultado.ventas)) return resultado.ventas;
            if (Array.isArray(resultado.listaVentas)) return resultado.listaVentas;
            if (Array.isArray(resultado.data)) return resultado.data;
            if (Array.isArray(resultado)) return resultado;

            return [];
        } else {
            console.error('Error al obtener transacciones', response.status, response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        return [];
    }
}


let ventasDelDia = [];

async function obtenerDetalleTransaccion(idVenta) {
    try {

        if (ventasDelDia.length === 0) {
            ventasDelDia = await obtenerTransacciones();
        }
        
        const ventaEncontrada = ventasDelDia.find(ventaItem => 
            ventaItem.ventaDto.id.toString() === idVenta.toString()
        );
        
        if (ventaEncontrada) {
            const venta = ventaEncontrada.ventaDto;
            
            return {
                id: venta.id,
                fecha: venta.fecha,
                total: venta.totalVenta,
                productos: venta.ventasDetalles.map(detalle => ({
                    nombre: detalle.producto.nombre,
                    cantidad: detalle.cantidadProducto,
                    precio: detalle.producto.precioUnitario,
                    subtotal: detalle.precioTotalxProducto
                }))
            };
        }
        
        return null;
    } catch (error) {
        console.error('Error al obtener detalle de transacción:', error);
        return null;
    }
}


async function cargarCaja() {
    const contenido = `
        <h2 class="mb-4">Caja</h2>
        
        <div class="row mb-4">
            <div class="col-md-4">
                <div class="card text-white bg-success">
                    <div class="card-body">
                        <h4 id="totalVentasHoy">Cargando...</h4>
                        <p class="mb-0">Total Ventas Hoy</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-white bg-info">
                    <div class="card-body">
                        <h4 id="transaccionesHoy">Cargando...</h4>
                        <p class="mb-0">Transacciones Hoy</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-white bg-warning">
                    <div class="card-body">
                        <h4 id="promedioVenta">Cargando...</h4>
                        <p class="mb-0">Promedio por Venta</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h5>Transacciones Recientes</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID Venta</th>
                                <th>Fecha/Hora</th>
                                <th>Total</th>
                                <th>Visualizar</th>
                            </tr>
                        </thead>
                        <tbody id="tablaTransacciones">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal Detalle Transacción -->
        <div class="modal fade" id="modalDetalleTransaccion" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detalle de la Transacción</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <strong>N° Transacción:</strong>
                                <p id="detalleNumero"></p>
                            </div>
                            <div class="col-md-6">
                                <strong>Fecha y Hora:</strong>
                                <p id="detalleFecha"></p>
                            </div>
                        </div>
                        <h6>Productos Vendidos:</h6>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio Unit.</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody id="detalleProductos">
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="row mt-3">
                            <div class="col-md-6 offset-md-6">
                                <table class="table table-sm">

                                    <tr class="table-active">
                                        <th>Total:</th>
                                        <th id="detalleTotal"></th>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('contenidoModulo').innerHTML = contenido;
    
    cargarEstadisticas();
    cargarTransacciones();
}

async function cargarEstadisticas() {
 
    ventasDelDia = [];
    
    const estadisticas = await obtenerEstadisticasCaja();
    
    if (estadisticas) {
     
        document.getElementById('totalVentasHoy').textContent = `$${estadisticas.totalVentas?.toLocaleString() || '0'}`;
        document.getElementById('transaccionesHoy').textContent = estadisticas.numeroTransacciones || '0';
        document.getElementById('promedioVenta').textContent = `$${estadisticas.promedioVenta?.toLocaleString() || '0'}`;
    } else {
   
        document.getElementById('totalVentasHoy').textContent = '$0';
        document.getElementById('transaccionesHoy').textContent = '0';
        document.getElementById('promedioVenta').textContent = '$0';
    }
}

async function cargarTransacciones() {
    const tbody = document.getElementById('tablaTransacciones');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center">Cargando transacciones...</td></tr>';
    
    const ventasData = await obtenerTransacciones();
    
  
    ventasDelDia = ventasData;
    
    tbody.innerHTML = '';
    
    if (ventasData && ventasData.length > 0) {
        ventasData.forEach(ventaItem => {
          
            const venta = ventaItem.ventaDto;
            const fila = document.createElement('tr');
            
            const fechaFormateada = formatearFecha(venta.fecha);
            
            fila.innerHTML = `
                <td>${venta.id}</td>
                <td>${fechaFormateada}</td>
                <td>$${(venta.totalVenta || 0).toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="verDetalleTransaccion('${venta.id}')">
                        <i class="bi bi-eye"></i> Ver
                    </button>
                </td>
            `;
            tbody.appendChild(fila);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay transacciones recientes</td></tr>';
    }
}

function formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    
    try {
        const fechaObj = new Date(fecha);
        return fechaObj.toLocaleString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return fecha; 
    }
}

async function verDetalleTransaccion(idVenta) {
    // Mostrar indicador de carga en el modal
    document.getElementById('detalleNumero').textContent = 'Cargando...';
    document.getElementById('detalleFecha').textContent = 'Cargando...';
    document.getElementById('detalleProductos').innerHTML = '<tr><td colspan="4" class="text-center">Cargando detalles...</td></tr>';
    document.getElementById('detalleTotal').textContent = 'Cargando...';

    // Mostrar el modal antes de cargar los datos
    const modal = new bootstrap.Modal(document.getElementById('modalDetalleTransaccion'));
    modal.show();

    // Obtener los detalles de la transacción desde la API
    const transaccion = await obtenerDetalleTransaccion(idVenta);
    
    if (!transaccion) {
        alert('No se pudo obtener el detalle de la transacción');
        modal.hide();
        return;
    }

    // Llenar los datos en el modal
    document.getElementById('detalleNumero').textContent = transaccion.id || transaccion.numero || idVenta;
    document.getElementById('detalleFecha').textContent = formatearFecha(transaccion.fecha || transaccion.fechaHora);

    // Llenar la tabla de productos
    const tbody = document.getElementById('detalleProductos');
    tbody.innerHTML = '';
    
    if (transaccion.productos && transaccion.productos.length > 0) {
        transaccion.productos.forEach(producto => {
            const fila = document.createElement('tr');
            const precio = producto.precio || producto.precioUnitario || 0;
            const cantidad = producto.cantidad || 1;
            const subtotal = producto.subtotal || (precio * cantidad);
            
            fila.innerHTML = `
                <td>${producto.nombre || producto.nombreProducto || 'Producto sin nombre'}</td>
                <td>${cantidad}</td>
                <td>$${precio.toLocaleString()}</td>
                <td>$${subtotal.toLocaleString()}</td>
            `;
            tbody.appendChild(fila);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay productos en esta transacción</td></tr>';
    }

    document.getElementById('detalleTotal').textContent = `$${(transaccion.total || 0).toLocaleString()}`;
}