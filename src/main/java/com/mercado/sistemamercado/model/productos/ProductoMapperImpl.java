package com.mercado.sistemamercado.model.productos;

import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Implementación de la interfaz ProductoMapper para mapear entre ProductoEntity y ProductoDto.
 */
@Component
public class ProductoMapperImpl implements ProductoMapper {

    /**
     * Mapea una ProductoEntity a un ProductoDto.
     * @param entity
     * @return ProductoDto
     */
    @Override
    public ProductoDto toDTO(ProductoEntity entity) {
        if (entity == null) {
            return null;
        }
        ProductoDto dto = new ProductoDto();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setCodigo(entity.getCodigo());
        dto.setDescripcion(entity.getDescripcion());
        dto.setPrecioUnitario(entity.getPrecioUnitario());
        dto.setStock(entity.getStock());
        return dto;
    }

    /**
     * Mapea un ProductoRequest y un UUID a una ProductoEntity.
     * @param id
     * @param request
     * @return ProductoEntity
     */
    @Override
    public ProductoEntity toEntity(UUID id, ProductoRequest request) {
        if (request == null) {
            return null;
        }
        ProductoEntity entity = new ProductoEntity();
        if (id != null) {
            entity.setId(id);
        }
        entity.setNombre(request.getNombre());
        entity.setCodigo(request.getCodigo());
        entity.setDescripcion(request.getDescripcion());
        entity.setPrecioUnitario(request.getPrecioUnitario());
        entity.setStock(request.getStock());
        return entity;
    }
}
