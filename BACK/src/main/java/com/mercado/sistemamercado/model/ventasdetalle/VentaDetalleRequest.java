package com.mercado.sistemamercado.model.ventasdetalle;

import lombok.Data;

import java.util.UUID;

@Data
public class VentaDetalleRequest {

    UUID venta = null;

    UUID producto;

    int cantidadProducto;

    double precioTotalxProducto;
}
