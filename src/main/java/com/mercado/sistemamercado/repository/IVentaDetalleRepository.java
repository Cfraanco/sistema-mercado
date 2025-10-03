package com.mercado.sistemamercado.repository;

import com.mercado.sistemamercado.model.ventasdetalle.VentaDetalleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IVentaDetalleRepository extends JpaRepository<VentaDetalleEntity, UUID> {

    List<VentaDetalleEntity>findAllByVentaId(UUID id);
    boolean existsByProductoId(UUID id);

    void deleteAllByProductoId(UUID productoId);
}
