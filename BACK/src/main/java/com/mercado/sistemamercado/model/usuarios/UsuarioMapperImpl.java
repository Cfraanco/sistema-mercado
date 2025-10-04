package com.mercado.sistemamercado.model.usuarios;

import org.springframework.stereotype.Component;

import java.util.UUID;
/**
 * Implementación de la interfaz UsuarioMapper para mapear entre UsuarioEntity y UsuarioDto.
 */
@Component
public class UsuarioMapperImpl implements UsuarioMapper {

    /**
     * Mapea una UsuarioEntity a un UsuarioDto.
     * @param entity
     * @return UsuarioDto
     */
    @Override
    public UsuarioDto toDTO(UsuarioEntity entity) {
        if (entity == null) {
            return null;
        }
        UsuarioDto dto = new UsuarioDto();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setCedula(entity.getCedula());
        dto.setRol(entity.getRol());
        dto.setContrasena(entity.getContrasena());
        return dto;
    }

    /**
     * Mapea un UsuarioRequest y un UUID a una UsuarioEntity.
     * @param id
     * @param usuarioRequest
     * @return UsuarioEntity
     */
    @Override
    public UsuarioEntity toEntity(UUID id, UsuarioRequest usuarioRequest) {
        if (usuarioRequest == null) {
            return null;
        }
        UsuarioEntity entity = new UsuarioEntity();
        if (id != null) {
            entity.setId(id);
        }
        entity.setNombre(usuarioRequest.getNombre());
        entity.setContrasena(usuarioRequest.getContrasena());
        entity.setCedula(usuarioRequest.getCedula());
        entity.setRol(usuarioRequest.getRol());
        return entity;
    }
}
