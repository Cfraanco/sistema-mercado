package com.mercado.sistemamercado.model.ventas;


import com.mercado.sistemamercado.model.productos.ProductoMapper;
import com.mercado.sistemamercado.model.ventasdetalle.VentaDetalleDto;
import com.mercado.sistemamercado.model.ventasdetalle.VentaDetalleEntity;
import com.mercado.sistemamercado.model.ventasdetalle.VentaDetalleMapper;
import com.mercado.sistemamercado.repository.IVentaDetalleRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Implementación de la interfaz VentaMapper para mapear entre VentaEntity y VentaDto.
 */
@Component
public class VentaMapperImpl implements VentaMapper {

    private final IVentaDetalleRepository ventaDetalleRepository;
    private final VentaDetalleMapper ventaDetalleMapper;

    /**
     * Constructor que inyecta el repositorio de detalles de venta y el mapper de detalles de venta.
     *
     * @param ventaDetalleRepository Repositorio de detalles de venta.
     * @param ventaDetalleMapper     Mapper de detalles de venta.
     */
    public VentaMapperImpl(IVentaDetalleRepository ventaDetalleRepository, VentaDetalleMapper ventaDetalleMapper) {
        this.ventaDetalleRepository = ventaDetalleRepository;
        this.ventaDetalleMapper = ventaDetalleMapper;
    }

    /**
     * Mapea una VentaEntity a un VentaDto.
     *
     * @param entity          Entidad de venta.
     * @param productoMapper  Mapper de productos para mapear los detalles de la venta.
     * @return DTO de venta.
     */
    @Override
    public VentaDto toDTO(VentaEntity entity, ProductoMapper productoMapper) {
        if (entity == null) {
            return null;
        }
        VentaDto dto = new VentaDto();
        dto.setId(entity.getId());
        dto.setFecha(entity.getFecha());
        dto.setTotalVenta(entity.getTotalVenta());
        List<VentaDetalleEntity> detalles = ventaDetalleRepository.findAllByVentaId(entity.getId());
        List<VentaDetalleDto> detallesDto = new ArrayList<>();
        for (VentaDetalleEntity detalle : detalles) {
            detallesDto.add(this.ventaDetalleMapper.toDTO(detalle, this, productoMapper));
        }
        dto.setVentasDetalles(detallesDto);
        return dto;
    }

    /**
     * Mapea un VentaRequest y un UUID a una VentaEntity.
     *
     * @param id  ID de la venta (puede ser nulo para nuevas ventas).
     * @param dto DTO de solicitud de venta.
     * @return Entidad de venta.
     */
    @Override
    public VentaEntity toEntity(UUID id, VentaRequest dto) {
        if (dto == null) {
            return null;
        }
        VentaEntity entity = new VentaEntity();
        if (id != null) {
            entity.setId(id);
        }
        entity.setFecha(LocalDateTime.now());
        entity.setTotalVenta(dto.getTotalVenta());
        return entity;
    }
}
