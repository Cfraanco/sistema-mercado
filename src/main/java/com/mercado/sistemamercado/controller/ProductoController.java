package com.mercado.sistemamercado.controller;

import com.mercado.sistemamercado.model.productos.ProductoDto;
import com.mercado.sistemamercado.model.productos.ProductoRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mercado.sistemamercado.services.productos.ProductoService;

import java.util.List;
import java.util.UUID;

/**
 * Controlador para manejar las solicitudes relacionadas con productos.
 */
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

  /**
     * Maneja la solicitud para listar productos.
     *
     * @param codigo Código del producto (opcional).
     * @return Respuesta HTTP con la lista de productos.
     */
    @GetMapping("/listar")
    public ResponseEntity<List<ProductoDto>> listar(@RequestParam(required = false) String codigo) {
        return ResponseEntity.ok(this.productoService.listar(codigo));
    }

    /**
     * Maneja la solicitud para crear un nuevo producto.
     *
     * @param request Objeto que contiene los datos del producto a crear.
     * @return Respuesta HTTP con el producto creado.
     */
    @PostMapping("/crear")
    public ResponseEntity<ProductoDto> crear(@RequestBody ProductoRequest request) {
        return ResponseEntity.ok(this.productoService.crear(request));
    }

    /**
     * Maneja la solicitud para actualizar un producto existente.
     *
     * @param id      ID del producto a actualizar.
     * @param request Objeto que contiene los datos actualizados del producto.
     * @return Respuesta HTTP con el producto actualizado.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductoDto> actualizar(@PathVariable UUID id, @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(this.productoService.actualizar(id, request));
    }


    /**
     * Maneja la solicitud para eliminar un producto por su ID.
     *
     * @param id ID del producto a eliminar.
     * @return Respuesta HTTP indicando el resultado de la operación.
     */
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable UUID id) {
        this.productoService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}
