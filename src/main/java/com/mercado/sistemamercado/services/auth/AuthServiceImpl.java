package com.mercado.sistemamercado.services.auth;

import com.mercado.sistemamercado.model.auth.AuthDto;
import com.mercado.sistemamercado.model.auth.AuthEntity;
import com.mercado.sistemamercado.model.auth.AuthMapper;
import com.mercado.sistemamercado.model.auth.AuthRequest;
import com.mercado.sistemamercado.model.usuarios.UsuarioEntity;
import com.mercado.sistemamercado.model.usuarios.UsuarioMapper;
import com.mercado.sistemamercado.repository.IAuthRepository;
import com.mercado.sistemamercado.repository.IUsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * Implementación del servicio de autenticación.
 * Proporciona la funcionalidad de inicio de sesión para los usuarios.
 */
@Service
public class AuthServiceImpl implements AuthService {

    IUsuarioRepository iUsuarioRepository;
    UsuarioMapper usuarioMapper;
    AuthMapper authMapper;
    IAuthRepository authRepository;

    /**
     * Constructor de la clase AuthServiceImpl.
     *
     * @param iUsuarioRepository Repositorio para acceder a los datos de los usuarios.
     * @param usuarioMapper      Mapeador para convertir entre entidades y DTOs de usuarios.
     * @param authMapper         Mapeador para convertir entre entidades y DTOs de autenticación.
     * @param authRepository     Repositorio para acceder a los datos de autenticación.
     */
    public AuthServiceImpl(IUsuarioRepository iUsuarioRepository, UsuarioMapper usuarioMapper, AuthMapper authMapper,
                           IAuthRepository authRepository) {
        this.iUsuarioRepository = iUsuarioRepository;
        this.usuarioMapper = usuarioMapper;
        this.authMapper = authMapper;
        this.authRepository = authRepository;
    }

    /**
     * Método para autenticar a un usuario.
     *
     * @param authRequest Objeto que contiene las credenciales del usuario.
     * @return Un objeto AuthDto que indica si la autenticación fue exitosa y contiene información del usuario.
     * @throws ResponseStatusException Si las credenciales son incorrectas, lanza una excepción con estado UNAUTHORIZED.
     */
    @Override
    public AuthDto login(AuthRequest authRequest) {
        UsuarioEntity usuario = iUsuarioRepository.findByCedulaAndContrasena(authRequest.getCedula(), authRequest.getContrasena());
        String mensaje;
        AuthEntity authEntity;
        AuthDto authDto;
        if (usuario != null) {
            mensaje = "Usuario Logueado";
            authDto = new AuthDto();
            authDto.setAutenticado(true);
            authDto.setUsuario(usuarioMapper.toDTO(usuario));
            authDto.setMensaje(mensaje);
            authEntity = this.authMapper.toEntity(authRequest,usuario,mensaje,authDto);
            this.authRepository.save(authEntity);
        }else {
            mensaje = "Usuario o Contraseña Incorrecta";
            authDto = new AuthDto();
            authDto.setAutenticado(false);
            authDto.setUsuario(usuarioMapper.toDTO(usuario));
            authDto.setMensaje(mensaje);
            authEntity = this.authMapper.toEntity(authRequest,usuario,mensaje,authDto);
            this.authRepository.save(authEntity);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, mensaje);
        }
        return authDto;
    }

}
