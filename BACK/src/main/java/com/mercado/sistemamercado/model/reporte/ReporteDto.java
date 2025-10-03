package com.mercado.sistemamercado.model.reporte;

import lombok.Data;

import java.util.List;

@Data
public class ReporteDto {

    private int numeroTransacciones;
    private List<ReporteVentaDetalleDto> ventas;
    private double totalIngresos;
}
