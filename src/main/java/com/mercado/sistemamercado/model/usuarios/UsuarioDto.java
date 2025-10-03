package com.mercado.sistemamercado.model.usuarios;

import lombok.Data;

import java.util.UUID;

@Data
public class UsuarioDto {

    UUID id;

    String nombre;

    String cedula;

    String rol;
}
