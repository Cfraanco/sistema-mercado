package com.mercado.sistemamercado.model.auth;

import com.mercado.sistemamercado.model.usuarios.UsuarioEntity;
import com.mercado.sistemamercado.model.usuarios.UsuarioMapper;
import com.mercado.sistemamercado.model.usuarios.UsuarioMapperImpl;
import com.mercado.sistemamercado.repository.IUsuarioRepository;
import org.springframework.stereotype.Component;

/**
 * Implementación de la interfaz AuthMapper para mapear entre AuthEntity y AuthDto.
 */
@Component
public class AuthMapperImpl implements AuthMapper {

    UsuarioMapper usuarioMapper = new UsuarioMapperImpl();
    IUsuarioRepository usuarioRepository;

    /**
     * Constructor que inyecta el repositorio de usuarios.
     *
     * @param usuarioRepository Repositorio de usuarios.
     */
    public AuthMapperImpl(IUsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Mapea una AuthEntity a un AuthDto.
     * @param entity
     * @return AuthDto
     */
    @Override
    public AuthDto toDTO(AuthEntity entity) {
        if (entity == null) {
            return null;
        } else {
            AuthDto dto = new AuthDto();
            dto.setUsuario(usuarioMapper.toDTO(entity.getUsuario()));
            dto.setMensaje(entity.getMensaje());
            dto.setAutenticado(entity.isAutenticado());
            return dto;
        }
    }

    /**
     * Mapea un AuthRequest, UsuarioEntity, mensaje y AuthDto a una AuthEntity.
     * @param authRequest
     * @param usuario
     * @param mensaje
     * @param authDto
     * @return AuthEntity
     */
    @Override
    public AuthEntity toEntity(AuthRequest authRequest, UsuarioEntity usuario, String mensaje, AuthDto authDto) {
        if (authRequest == null) {
            return null;
        } else {
            AuthEntity entity = new AuthEntity();
            entity.setUsuario(usuario);
            entity.setMensaje(mensaje);
            entity.setAutenticado(authDto.isAutenticado());
            entity.setCedula(authRequest.getCedula());
            entity.setContrasena(authRequest.getContrasena());
            return entity;
        }
    }
}
