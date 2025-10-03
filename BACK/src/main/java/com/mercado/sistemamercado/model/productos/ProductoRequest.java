package com.mercado.sistemamercado.model.productos;

import lombok.Data;

@Data
public class ProductoRequest {

    String codigo;

    String nombre;

    String descripcion;

    double precioUnitario;

    int stock;
}
