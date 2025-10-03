function cargarReportes() {
    const contenido = `
        <h2 class="mb-4">Reportes de ventas</h2>
        
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h6>Generar Reporte</h6>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">Fecha Desde</label>
                            <input type="date" class="form-control" id="fechaDesde">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Fecha Hasta</label>
                            <input type="date" class="form-control" id="fechaHasta">
                        </div>
                        <button class="btn btn-primary w-100" onclick="generarReporte()">
                            <i class="bi bi-file-earmark-text"></i> Generar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modal para elegir formato de reporte -->
        <div class="modal fade" id="modalFormato" tabindex="-1" aria-labelledby="modalFormatoLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalFormatoLabel">Generar Reporte</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>El reporte se ha generado exitosamente. ¿En qué formato desea descargarlo?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" onclick="descargarReporte('csv')">
                            <i class="bi bi-file-earmark-spreadsheet"></i> Descargar CSV
                        </button>
                        <button type="button" class="btn btn-danger" onclick="descargarReporte('pdf')">
                            <i class="bi bi-file-earmark-pdf"></i> Descargar PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('contenidoModulo').innerHTML = contenido;
    
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaDesde').value = hoy;
    document.getElementById('fechaHasta').value = hoy;
}

let datosReporte = [];

async function generarReporte() {
    const fechaInicial = document.getElementById('fechaDesde').value;
    const fechaFinal = document.getElementById('fechaHasta').value;

    if (!fechaInicial || !fechaFinal) {
        alert('Por favor seleccione ambas fechas');
        return;
    }

    reporteRequest = {
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal
    };

    try {
        const response = await fetch('http://localhost:8080/api/reportes/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reporteRequest)
        });
        
        datosReporte = await response.json();
        
        mostrarModalFormato();
        
    } catch (error) {
        console.error('Error al generar el reporte:', error);
        alert('Error al generar el reporte. Por favor intente nuevamente.');
    }
}

function mostrarModalFormato() {
    const modal = new bootstrap.Modal(document.getElementById('modalFormato'));
    modal.show();
}

function descargarReporte(formato) {
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalFormato'));
    modal.hide();
    
    if (formato === 'csv') {
        generarCSV();
    } else if (formato === 'pdf') {
        generarPDF();
    }
}

function procesarDatosVentas(datosReporte) {
    const ventasFlat = [];
    
    if (!datosReporte.ventas) {
        return ventasFlat;
    }
    
    datosReporte.ventas.forEach(venta => {
        const ventaInfo = venta.ventaDto;
        
        ventaInfo.ventasDetalles.forEach(detalle => {
            ventasFlat.push({
                ventaId: ventaInfo.id,
                fecha: new Date(ventaInfo.fecha).toLocaleDateString('es-ES'),
                hora: new Date(ventaInfo.fecha).toLocaleTimeString('es-ES'),
                totalVenta: ventaInfo.totalVenta,
                productoId: detalle.producto.id,
                productoCodigo: detalle.producto.codigo,
                productoNombre: detalle.producto.nombre,
                productoDescripcion: detalle.producto.descripcion,
                precioUnitario: detalle.producto.precioUnitario,
                stockDisponible: detalle.producto.stock,
                cantidad: detalle.cantidadProducto,
                totalProducto: detalle.precioTotalxProducto
            });
        });
    });
    
    return ventasFlat;
}

function generarCSV() {
    if (!datosReporte || !datosReporte.ventas || datosReporte.ventas.length === 0) {
        alert('No hay datos para generar el reporte');
        return;
    }
    
    const ventasFlat = procesarDatosVentas(datosReporte);
    
    // Crear headers del CSV
    const headers = [
        'ID Venta',
        'Fecha',
        'Hora',
        'Total Venta',
        'Código Producto',
        'Nombre Producto',
        'Descripción',
        'Precio Unitario',
        'Cantidad',
        'Total Producto'
    ];
    
    // Crear filas del CSV
    const filas = ventasFlat.map(venta => [
        venta.ventaId,
        venta.fecha,
        venta.hora,
        venta.totalVenta,
        venta.productoCodigo,
        venta.productoNombre,
        venta.productoDescripcion,
        venta.precioUnitario,
        venta.cantidad,
        venta.totalProducto,
    ]);
    
    // Combinar headers y filas
    const csvContent = [headers, ...filas]
        .map(fila => fila.map(campo => `"${campo}"`).join(','))
        .join('\n');
    
    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_ventas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generarPDF() {
    if (!datosReporte || !datosReporte.ventas || datosReporte.ventas.length === 0) {
        alert('No hay datos para generar el reporte');
        return;
    }
    
    const ventasFlat = procesarDatosVentas(datosReporte);
    
    // Verificar si jsPDF está disponible
    if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
        alert('Error: La librería jsPDF no está cargada. Por favor recargue la página.');
        return;
    }
    
    // Acceder a jsPDF correctamente según cómo esté disponible
    const jsPDF = window.jspdf?.jsPDF || window.jsPDF;
    const doc = new jsPDF();
    
    // Título del reporte
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Reporte de Ventas', 20, 20);
    
    // Información del reporte
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, 30);
    doc.text(`Número de transacciones: ${datosReporte.numeroTransacciones}`, 20, 38);
    doc.text(`Total de ingresos: $${datosReporte.totalIngresos.toLocaleString('es-ES')}`, 20, 46);
    
    let yPosition = 60;
    
    // Agrupar ventas por ID
    const ventasAgrupadas = {};
    ventasFlat.forEach(item => {
        if (!ventasAgrupadas[item.ventaId]) {
            ventasAgrupadas[item.ventaId] = {
                fecha: item.fecha,
                hora: item.hora,
                totalVenta: item.totalVenta,
                productos: []
            };
        }
        ventasAgrupadas[item.ventaId].productos.push(item);
    });
    
    // Generar contenido para cada venta
    Object.keys(ventasAgrupadas).forEach((ventaId, index) => {
        const venta = ventasAgrupadas[ventaId];
        
        // Verificar si necesitamos nueva página
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }
        
        // Información de la venta
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`Venta #${index + 1}`, 20, yPosition);
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        yPosition += 8;
        doc.text(`ID: ${ventaId}`, 20, yPosition);
        yPosition += 6;
        doc.text(`Fecha: ${venta.fecha} - Hora: ${venta.hora}`, 20, yPosition);
        yPosition += 6;
        doc.text(`Total: $${venta.totalVenta.toLocaleString('es-ES')}`, 20, yPosition);
        yPosition += 10;
        
        // Productos de la venta
        doc.setFont(undefined, 'bold');
        doc.text('Productos:', 20, yPosition);
        yPosition += 6;
        
        venta.productos.forEach(producto => {
            doc.setFont(undefined, 'normal');
            doc.text(`• ${producto.productoNombre} (${producto.productoCodigo})`, 25, yPosition);
            yPosition += 5;
            doc.text(`  Descripción: ${producto.productoDescripcion}`, 25, yPosition);
            yPosition += 5;
            doc.text(`  Precio unitario: $${producto.precioUnitario.toLocaleString('es-ES')} - Cantidad: ${producto.cantidad}`, 25, yPosition);
            yPosition += 5;
            doc.text(`  Total producto: $${producto.totalProducto.toLocaleString('es-ES')}`, 25, yPosition);
            yPosition += 8;
        });
        
        yPosition += 5;
        
        // Línea separadora
        if (index < Object.keys(ventasAgrupadas).length - 1) {
            doc.setDrawColor(200, 200, 200);
            doc.line(20, yPosition, 190, yPosition);
            yPosition += 10;
        }
    });
    
    // Guardar el PDF
    doc.save(`reporte_ventas_${new Date().toISOString().split('T')[0]}.pdf`);
}


