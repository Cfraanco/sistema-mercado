package com.mercado.sistemamercado.services.ventas;

import com.mercado.sistemamercado.model.ventas.VentaDto;
import com.mercado.sistemamercado.model.ventas.VentaRequest;

import java.util.List;

/**
 * Interfaz del servicio de ventas.
 * Define los métodos para listar y crear ventas.
 */
public interface VentaService {
    List<VentaDto> listar();
    Object crear(VentaRequest request);
}
