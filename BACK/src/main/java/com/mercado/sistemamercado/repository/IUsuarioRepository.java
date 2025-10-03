package com.mercado.sistemamercado.repository;

import com.mercado.sistemamercado.model.usuarios.UsuarioEntity;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

@Repository
public interface IUsuarioRepository extends JpaRepository<UsuarioEntity, UUID> {

    UsuarioEntity findByCedulaAndContrasena(String cedula, String contrasena);
}