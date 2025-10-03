package com.mercado.sistemamercado.model.ventasdetalle;

import lombok.Data;
import com.mercado.sistemamercado.model.productos.ProductoDto;

@Data
public class VentaDetalleDto {

    ProductoDto producto;

    int cantidadProducto;

    double precioTotalxProducto;
}
