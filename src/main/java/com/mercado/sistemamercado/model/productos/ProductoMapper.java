package com.mercado.sistemamercado.model.productos;


import java.util.UUID;

/**
 * Interfaz para mapear entre ProductoEntity y ProductoDto.
 */
public interface ProductoMapper {

    ProductoDto toDTO(ProductoEntity entity);

    ProductoEntity toEntity(UUID id, ProductoRequest request);
}
