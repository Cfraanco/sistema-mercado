package com.mercado.sistemamercado.model.ventas;

import com.mercado.sistemamercado.model.productos.ProductoMapper;

import java.util.UUID;

/**
 * Interfaz para mapear entre VentaEntity y VentaDto.
 */
public interface VentaMapper {

    VentaDto toDTO(VentaEntity entity, ProductoMapper productoMapper);

    VentaEntity toEntity(UUID id, VentaRequest ventaDto);
}
