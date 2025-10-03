package com.mercado.sistemamercado.model.usuarios;

import lombok.Data;
@Data
public class UsuarioRequest {

    String nombre;

    String cedula;

    String contrasena;

    String rol;
}
