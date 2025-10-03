package com.mercado.sistemamercado.repository;

import com.mercado.sistemamercado.model.auth.AuthEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface IAuthRepository extends JpaRepository<AuthEntity, UUID> {

    void deleteAllByUsuarioId(UUID id);

    boolean existsByUsuarioId(UUID id);
}
