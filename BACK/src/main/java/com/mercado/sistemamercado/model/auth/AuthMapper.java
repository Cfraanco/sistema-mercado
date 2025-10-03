package com.mercado.sistemamercado.model.auth;

import com.mercado.sistemamercado.model.usuarios.UsuarioEntity;

/**
 * Interfaz para mapear entre AuthEntity y AuthDto.
 */
public interface AuthMapper {

    AuthDto toDTO(AuthEntity entity);

    AuthEntity toEntity(AuthRequest authRequest, UsuarioEntity usuario, String mensaje, AuthDto authDto);
}
