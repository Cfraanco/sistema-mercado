package com.mercado.sistemamercado.controller;

import com.mercado.sistemamercado.model.reporte.ReporteDto;
import com.mercado.sistemamercado.model.reporte.ReporteRequest;
import com.mercado.sistemamercado.services.reportes.ReporteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para manejar las solicitudes relacionadas con reportes.
 */
@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    /**
     * Maneja la solicitud para crear un nuevo reporte.
     *
     * @param reporteRequest Objeto que contiene los datos del reporte a crear.
     * @return Respuesta HTTP con el reporte creado.
     */
    @PostMapping("/crear")
    public ResponseEntity<ReporteDto> crear(@RequestBody ReporteRequest reporteRequest) {
        return ResponseEntity.ok(this.reporteService.crear(reporteRequest));
    }
}
