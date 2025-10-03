package com.mercado.sistemamercado.model.ventasdetalle;

import com.mercado.sistemamercado.model.productos.ProductoMapper;
import com.mercado.sistemamercado.model.ventas.VentaMapper;
import com.mercado.sistemamercado.repository.IProductoRepository;
import com.mercado.sistemamercado.repository.IVentaRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Implementación de la interfaz VentaDetalleMapper para mapear entre VentaDetalleEntity y VentaDetalleDto.
 */
@Component
public class VentaDetalleMapperImpl implements VentaDetalleMapper {

    private final IVentaRepository ventaRepository;
    private final IProductoRepository productoRepository;

    /**
     * Constructor que inyecta los repositorios de venta y producto.
     *
     * @param ventaRepository   Repositorio de ventas.
     * @param productoRepository Repositorio de productos.
     */
    public VentaDetalleMapperImpl(IVentaRepository ventaRepository, IProductoRepository productoRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
    }

    /**
     * Mapea una VentaDetalleEntity a un VentaDetalleDto.
     *
     * @param entity          Entidad de detalle de venta.
     * @param ventaMapper     Mapper de ventas para mapear la venta asociada.
     * @param productoMapper  Mapper de productos para mapear el producto asociado.
     * @return DTO de detalle de venta.
     */
    @Override
    public VentaDetalleDto toDTO(VentaDetalleEntity entity, VentaMapper ventaMapper, ProductoMapper productoMapper) {
        if (entity == null) {
            return null;
        }
        VentaDetalleDto dto = new VentaDetalleDto();
        dto.setProducto(productoMapper.toDTO(entity.getProducto()));
        dto.setCantidadProducto(entity.getCantidadProducto());
        dto.setPrecioTotalxProducto(entity.getPrecioTotalxProducto());
        return dto;
    }

    /**
     * Mapea un VentaDetalleRequest a una VentaDetalleEntity.
     *
     * @param ventaDetalleRequest Request de detalle de venta.
     * @return Entidad de detalle de venta.
     */
    @Override
    public VentaDetalleEntity toEntity(VentaDetalleRequest ventaDetalleRequest) {
        if (ventaDetalleRequest == null) {
            return null;
        }
        VentaDetalleEntity entity = new VentaDetalleEntity();
        entity.setVenta(ventaRepository.findVentaById(ventaDetalleRequest.getVenta()));
        entity.setProducto(productoRepository.findProductoById((ventaDetalleRequest.getProducto())));
        entity.setCantidadProducto(ventaDetalleRequest.getCantidadProducto());
        entity.setPrecioTotalxProducto(ventaDetalleRequest.getPrecioTotalxProducto());
        return entity;
    }

    @Override
    public List<VentaDetalleDto> toDTOList(List<VentaDetalleEntity> entities, VentaMapper ventaMapper, ProductoMapper productoMapper) {
        List<VentaDetalleDto> ventaDetalleDtoList = new ArrayList<>();
       for(VentaDetalleEntity entity : entities) {
         VentaDetalleDto dto;
            dto=toDTO(entity,ventaMapper, productoMapper);
            ventaDetalleDtoList.add(dto);
       }
         return ventaDetalleDtoList;
    }
}
