package com.mercado.sistemamercado.services.productos;

import com.mercado.sistemamercado.model.productos.ProductoDto;
import com.mercado.sistemamercado.model.productos.ProductoEntity;
import com.mercado.sistemamercado.model.productos.ProductoMapper;
import com.mercado.sistemamercado.model.productos.ProductoRequest;
import com.mercado.sistemamercado.repository.IProductoRepository;
import com.mercado.sistemamercado.repository.IVentaDetalleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Implementación del servicio de productos.
 * Proporciona métodos para listar, crear, actualizar y eliminar productos.
 */
@Service
public class ProductoServiceImpl implements ProductoService{

    private final IProductoRepository productoRepository;
    private final ProductoMapper productoMapper;
    private final IVentaDetalleRepository ventaDetalleRepository;

    /**
     * Constructor para inyección de dependencias.
     *
     * @param productoRepository      Repositorio para operaciones de productos.
     * @param productoMapper          Mapper para convertir entre entidades y DTOs de productos.
     * @param ventaDetalleRepository  Repositorio para operaciones de detalles de ventas.
     */
    public ProductoServiceImpl(IProductoRepository productoRepository, ProductoMapper productoMapper,
                               IVentaDetalleRepository ventaDetalleRepository) {
        this.productoRepository = productoRepository;
        this.productoMapper = productoMapper;
        this.ventaDetalleRepository = ventaDetalleRepository;
    }

    /**
     * Lista todos los productos registrados en el sistema.
     *
     * @param codigo Código del producto a buscar (opcional).
     * @return Lista de productos en formato DTO.
     */
    @Override
    public List<ProductoDto> listar(String codigo) {
        List<ProductoEntity> productos;
        List<ProductoDto> productoDtos = new ArrayList<>();
        if (codigo == null || codigo.isEmpty()) {
            productos = this.productoRepository.findAll();
            for (ProductoEntity productoEntity : productos) {
                productoDtos.add(this.productoMapper.toDTO(productoEntity));
            }
        } else {
           ProductoEntity producto = this.productoRepository.findProductoByCodigoContaining(codigo);
           productoDtos.add(this.productoMapper.toDTO(producto));
        }

        return productoDtos;
    }

    /**
     * Crea un nuevo producto en el sistema.
     *
     * @param request Datos del producto a crear.
     * @return Producto creado en formato DTO.
     */
    @Override
    public ProductoDto crear(ProductoRequest request) {
        return this.productoMapper.toDTO(productoRepository.save(this.productoMapper.toEntity(null,request)));
    }

    /**
     * Actualiza un producto existente en el sistema.
     *
     * @param id      ID del producto a actualizar.
     * @param request Datos actualizados del producto.
     * @return Producto actualizado en formato DTO.
     */
    @Override
    public ProductoDto actualizar(UUID id, ProductoRequest request) {
        return this.productoMapper.toDTO(productoRepository.save(this.productoMapper.toEntity(id,request)));
    }

    /**
     * Elimina un producto del sistema.
     * Si el producto está asociado a detalles de ventas, se eliminan esos detalles primero.
     *
     * @param id ID del producto a eliminar.
     */
    @Override
    @Transactional
    public void eliminar(UUID id) {
        if(this.ventaDetalleRepository.existsByProductoId(id)){
            this.ventaDetalleRepository.deleteAllByProductoId(id);
        }
        this.productoRepository.deleteById(id);
    }
}

