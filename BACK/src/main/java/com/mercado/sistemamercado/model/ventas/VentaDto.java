package com.mercado.sistemamercado.model.ventas;

import com.mercado.sistemamercado.model.ventasdetalle.VentaDetalleDto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class VentaDto {

    UUID id;

    LocalDateTime fecha;

    double totalVenta;

    List<VentaDetalleDto> ventasDetalles;

}
