package com.mercado.sistemamercado.services.ventas;

import com.mercado.sistemamercado.model.productos.ProductoEntity;
import com.mercado.sistemamercado.model.productos.ProductoMapper;
import com.mercado.sistemamercado.model.ventas.VentaDto;
import com.mercado.sistemamercado.model.ventas.VentaEntity;
import com.mercado.sistemamercado.model.ventas.VentaMapper;
import com.mercado.sistemamercado.model.ventas.VentaRequest;
import com.mercado.sistemamercado.model.ventasdetalle.VentaDetalleMapper;
import com.mercado.sistemamercado.model.ventasdetalle.VentaDetalleRequest;
import com.mercado.sistemamercado.repository.IProductoRepository;
import com.mercado.sistemamercado.repository.IVentaDetalleRepository;
import com.mercado.sistemamercado.repository.IVentaRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Implementación del servicio de ventas.
 * Proporciona métodos para listar y crear ventas.
 */
@Service
@Log4j2
public class VentaServiceImpl implements VentaService {

    private final IProductoRepository productoRepository;
    private final IVentaRepository ventaRepository;
    private final IVentaDetalleRepository ventaDetalleRepository;
    private final VentaMapper ventaMapper;
    private final ProductoMapper productoMapper;
    private final VentaDetalleMapper ventaDetalleMapper;

    /**
     * Constructor para inyección de dependencias.
     *
     * @param productoRepository      Repositorio para operaciones de productos.
     * @param ventaRepository         Repositorio para operaciones de ventas.
     * @param ventaDetalleRepository  Repositorio para operaciones de detalles de ventas.
     * @param ventaMapper             Mapper para convertir entre entidades y DTOs de ventas.
     * @param productoMapper          Mapper para convertir entre entidades y DTOs de productos.
     * @param ventaDetalleMapper      Mapper para convertir entre entidades y DTOs de detalles de ventas.
     */
    public VentaServiceImpl(IProductoRepository productoRepository, IVentaRepository ventaRepository,
                            IVentaDetalleRepository ventaDetalleRepository, VentaMapper ventaMapper,
                            ProductoMapper productoMapper, VentaDetalleMapper ventaDetalleMapper) {
        this.productoRepository = productoRepository;
        this.ventaRepository = ventaRepository;
        this.ventaDetalleRepository = ventaDetalleRepository;
        this.ventaMapper = ventaMapper;
        this.productoMapper = productoMapper;
        this.ventaDetalleMapper = ventaDetalleMapper;
    }

    /**
     * Lista todas las ventas registradas en el sistema.
     *
     * @return Una lista de objetos VentaDto que representan las ventas.
     */
    @Override
    public List<VentaDto> listar() {
        List<VentaEntity> ventas = ventaRepository.findAll();
        List<VentaDto> ventasDto = new ArrayList<>();
        for (VentaEntity ventaEntity : ventas) {
            ventasDto.add(this.ventaMapper.toDTO(ventaEntity, this.productoMapper));
        }
        return ventasDto;
    }


    /**
     * Crea una nueva venta y actualiza el stock de los productos vendidos.
     *
     * @param request El objeto VentaRequest que contiene los detalles de la venta.
     * @return Un objeto VentaDto que representa la venta creada.
     * @throws ResponseStatusException Si no hay suficiente stock para alguno de los productos.
     */

    @Override
    public VentaDto crear(VentaRequest request) {
        List<VentaDetalleRequest> detalles = request.getVentaDetalle();

        for (VentaDetalleRequest detalleRequest : detalles) {
            UUID productoId = detalleRequest.getProducto();
            int cantidadVendida = detalleRequest.getCantidadProducto();
            ProductoEntity producto = productoRepository.findProductoById(productoId);
            if (producto == null || producto.getStock() < cantidadVendida) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock insuficiente para el producto: " + productoId);
            }
        }

        VentaEntity ventaEntity = ventaRepository.save(this.ventaMapper.toEntity(null, request));
        for (VentaDetalleRequest detalleRequest : detalles) {
            UUID productoId = detalleRequest.getProducto();
            int cantidadVendida = detalleRequest.getCantidadProducto();
            ProductoEntity producto = productoRepository.findProductoById(productoId);
            producto.setStock(producto.getStock() - cantidadVendida);
            productoRepository.save(producto);
            detalleRequest.setVenta(ventaEntity.getId());
            ventaDetalleRepository.save(ventaDetalleMapper.toEntity(detalleRequest));
        }
        return this.ventaMapper.toDTO(ventaEntity, this.productoMapper);
    }

}
