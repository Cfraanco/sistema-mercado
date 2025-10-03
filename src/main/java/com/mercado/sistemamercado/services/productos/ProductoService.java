package com.mercado.sistemamercado.services.productos;

import com.mercado.sistemamercado.model.productos.ProductoDto;
import com.mercado.sistemamercado.model.productos.ProductoRequest;

import java.util.List;
import java.util.UUID;

/**
 * Interfaz del servicio de productos.
 * Define el contrato para la gestión de productos en el sistema.
 */
public interface ProductoService {

    List<ProductoDto> listar(String codigo);
    ProductoDto crear(ProductoRequest request);
    ProductoDto actualizar(UUID id, ProductoRequest request);
    void eliminar(UUID id);
}
