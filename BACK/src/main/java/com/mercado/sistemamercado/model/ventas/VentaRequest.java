package com.mercado.sistemamercado.model.ventas;

import com.mercado.sistemamercado.model.ventasdetalle.VentaDetalleRequest;
import lombok.Data;

import java.util.List;

@Data
public class VentaRequest {

    double totalVenta;

    List<VentaDetalleRequest> ventaDetalle;

}
