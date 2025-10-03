package com.mercado.sistemamercado.services.usuarios;

import com.mercado.sistemamercado.model.usuarios.UsuarioDto;
import com.mercado.sistemamercado.model.usuarios.UsuarioEntity;
import com.mercado.sistemamercado.model.usuarios.UsuarioMapper;
import com.mercado.sistemamercado.model.usuarios.UsuarioRequest;
import com.mercado.sistemamercado.repository.IAuthRepository;
import com.mercado.sistemamercado.repository.IUsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
/**
 * Implementación del servicio de usuarios.
 * Proporciona métodos para listar, crear, actualizar y eliminar usuarios.
 */
@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final IUsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final IAuthRepository authRepository;

    /**
     * Constructor para inyección de dependencias.
     *
     * @param usuarioRepository Repositorio para operaciones de usuarios.
     * @param usuarioMapper     Mapper para convertir entre entidades y DTOs de usuarios.
     * @param authRepository    Repositorio para operaciones de autenticación.
     */
    public UsuarioServiceImpl(IUsuarioRepository usuarioRepository, UsuarioMapper usuarioMapper,
                              IAuthRepository authRepository) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
        this.authRepository = authRepository;
    }

    /**
     * Lista todos los usuarios registrados en el sistema.
     *
     * @return Lista de usuarios en formato DTO.
     */
    @Override
    public List<UsuarioDto> listar() {
        List<UsuarioEntity> usuarios = this.usuarioRepository.findAll();
        List<UsuarioDto> usuariosDto = new ArrayList<>();
        for (UsuarioEntity usuarioEntity : usuarios) {
            usuariosDto.add(this.usuarioMapper.toDTO(usuarioEntity));
        }
        return usuariosDto;
    }

    /**
     * Crea un nuevo usuario en el sistema.
     *
     * @param request Datos del usuario a crear.
     * @return Usuario creado en formato DTO.
     */
    @Override
    public UsuarioDto crear(UsuarioRequest request) {
        return this.usuarioMapper.toDTO(usuarioRepository.save(this.usuarioMapper.toEntity(null,request)));
    }

    /**
     * Actualiza un usuario existente en el sistema.
     *
     * @param id      ID del usuario a actualizar.
     * @param request Datos actualizados del usuario.
     * @return Usuario actualizado en formato DTO.
     * @throws Exception Si el usuario no existe.
     */
    @Override
    public UsuarioDto actualizar(UUID id, UsuarioRequest request) throws Exception {
        if(!this.usuarioRepository.existsById(id)){
            throw new ResponseStatusException(HttpStatusCode.valueOf(400));
        }
        return this.usuarioMapper.toDTO(usuarioRepository.save(this.usuarioMapper.toEntity(id, request)));

    }

    /**
     * Elimina un usuario del sistema.
     *
     * @param id ID del usuario a eliminar.
     */
    @Override
    @Transactional
    public void eliminar(UUID id) {
        if(this.authRepository.existsByUsuarioId(id)){
            this.authRepository.deleteAllByUsuarioId(id);
        }
        this.usuarioRepository.deleteById(id);
    }
}
