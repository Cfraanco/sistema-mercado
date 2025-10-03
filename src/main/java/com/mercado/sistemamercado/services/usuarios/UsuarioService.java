package com.mercado.sistemamercado.services.usuarios;

import com.mercado.sistemamercado.model.usuarios.UsuarioDto;
import com.mercado.sistemamercado.model.usuarios.UsuarioRequest;

import java.util.List;
import java.util.UUID;

/**
 * Interfaz del servicio de usuarios.
 * Define los métodos para listar, crear, actualizar y eliminar usuarios.
 */
public interface UsuarioService {
    List<UsuarioDto> listar();
    UsuarioDto crear(UsuarioRequest request);
    UsuarioDto actualizar(UUID id, UsuarioRequest request) throws Exception;
    void eliminar(UUID id);
}
