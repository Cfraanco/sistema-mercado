package com.mercado.sistemamercado.model.productos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Data
@Getter
@Setter
public class ProductoDto {

    UUID id;

    String codigo;

    String nombre;

    String descripcion;

    double precioUnitario;

    int stock;

}
