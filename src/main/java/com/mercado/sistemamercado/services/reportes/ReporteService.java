package com.mercado.sistemamercado.services.reportes;

import com.mercado.sistemamercado.model.reporte.ReporteDto;
import com.mercado.sistemamercado.model.reporte.ReporteRequest;

/**
 * Interfaz del servicio de reportes.
 * Define el método para crear reportes de ventas.
 */
public interface ReporteService {
    ReporteDto crear(ReporteRequest reporteRequest);
}
