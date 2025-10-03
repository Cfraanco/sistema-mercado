package com.mercado.sistemamercado.repository;

import com.mercado.sistemamercado.model.productos.ProductoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface IProductoRepository extends JpaRepository<ProductoEntity, UUID> {

    ProductoEntity findProductoById(UUID id);

    ProductoEntity findProductoByCodigoContaining(String codigo);
}