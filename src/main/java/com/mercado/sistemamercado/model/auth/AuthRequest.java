package com.mercado.sistemamercado.model.auth;

import lombok.Data;

@Data
public class AuthRequest {

    private String cedula;
    private String contrasena;
}
