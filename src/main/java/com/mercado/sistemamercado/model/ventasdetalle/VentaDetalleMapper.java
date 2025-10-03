package com.mercado.sistemamercado.model.ventasdetalle;

import com.mercado.sistemamercado.model.productos.ProductoMapper;
import com.mercado.sistemamercado.model.ventas.VentaMapper;

import java.util.List;

/**
 * Interfaz para mapear entre VentaDetalleEntity y VentaDetalleDto.
 */
public interface VentaDetalleMapper {

    VentaDetalleDto toDTO(VentaDetalleEntity entity, VentaMapper ventaMapper, ProductoMapper productoMapper);

    VentaDetalleEntity toEntity(VentaDetalleRequest ventaDetalleRequest);

    List<VentaDetalleDto> toDTOList(List<VentaDetalleEntity> entities, VentaMapper ventaMapper, ProductoMapper productoMapper);
}
