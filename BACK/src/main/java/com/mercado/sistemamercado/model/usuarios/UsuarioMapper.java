package com.mercado.sistemamercado.model.usuarios;

import java.util.UUID;

/**
 * Interfaz para mapear entre UsuarioEntity y UsuarioDto.
 */
public interface UsuarioMapper {

    UsuarioDto toDTO(UsuarioEntity entity);

    UsuarioEntity toEntity(UUID id, UsuarioRequest usuarioRequest);
}
