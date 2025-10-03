package com.mercado.sistemamercado.repository;

import com.mercado.sistemamercado.model.ventas.VentaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface IVentaRepository extends JpaRepository<VentaEntity, UUID> {
    VentaEntity findVentaById(UUID id);

    List<VentaEntity> findAllByFechaBetween(LocalDateTime fechaAfter, LocalDateTime fechaBefore);
}
