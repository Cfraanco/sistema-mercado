package com.mercado.sistemamercado.model.auth;

import com.mercado.sistemamercado.model.usuarios.UsuarioDto;
import lombok.Data;

@Data
public class AuthDto {

    private boolean autenticado;
    private String mensaje;
    private UsuarioDto usuario;

}
