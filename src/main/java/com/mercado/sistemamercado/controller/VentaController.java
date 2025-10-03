package com.mercado.sistemamercado.controller;

import com.mercado.sistemamercado.model.ventas.VentaDto;
import com.mercado.sistemamercado.model.ventas.VentaRequest;
import com.mercado.sistemamercado.services.ventas.VentaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para gestionar las operaciones relacionadas con las ventas.
 */
@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    /**
     * Maneja la solicitud para listar todas las ventas.
     * @return Respuesta HTTP con la lista de ventas.
     */
    @GetMapping("/listar")
    public ResponseEntity<List<VentaDto>> listar() {
        return ResponseEntity.ok(this.ventaService.listar());
    }

    /**
     * Maneja la solicitud para crear una nueva venta.
     *
     * @param request Datos de la venta a crear.
     * @return Respuesta HTTP con la venta creada.
     */
    @PostMapping("/crear")
    public ResponseEntity<VentaDto> crear(@RequestBody VentaRequest request) {
        return ResponseEntity.ok((VentaDto) this.ventaService.crear(request));
    }

}
