package com.mercado.sistemamercado.services.reportes;

import com.mercado.sistemamercado.model.productos.ProductoMapper;
import com.mercado.sistemamercado.model.reporte.ReporteDto;
import com.mercado.sistemamercado.model.reporte.ReporteRequest;
import com.mercado.sistemamercado.model.reporte.ReporteVentaDetalleDto;
import com.mercado.sistemamercado.model.ventas.VentaEntity;
import com.mercado.sistemamercado.model.ventas.VentaMapper;
import com.mercado.sistemamercado.repository.IVentaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementación del servicio de reportes.
 * Proporciona métodos para generar reportes de ventas.
 */
@Service
public class ReporteServiceImpl implements ReporteService {

    private final IVentaRepository ventaRepository;
    private final VentaMapper ventaMapper;
    private final ProductoMapper productoMapper;

    /**
     * Constructor para inyección de dependencias.
     *
     * @param ventaRepository Repositorio para operaciones de ventas.
     * @param ventaMapper    Mapper para convertir entre entidades y DTOs de ventas.
     * @param productoMapper Mapper para convertir entre entidades y DTOs de productos.
     */
    public ReporteServiceImpl(IVentaRepository ventaRepository,VentaMapper ventaMapper,
                              ProductoMapper productoMapper) {
        this.ventaRepository = ventaRepository;
        this.ventaMapper = ventaMapper;
        this.productoMapper = productoMapper;
    }

    /**
     * Genera un reporte de ventas entre dos fechas.
     *
     * @param reporteRequest Datos del rango de fechas para el reporte.
     * @return Reporte de ventas en formato DTO.
     */
    @Override
    public ReporteDto crear(ReporteRequest reporteRequest) {
        ReporteDto reporteDto = new ReporteDto();
        LocalDateTime inicio = LocalDate.parse(reporteRequest.getFechaInicial()).atStartOfDay();
        LocalDateTime fin =  LocalDate.parse(reporteRequest.getFechaFinal()).atTime(LocalTime.MAX);
        List<ReporteVentaDetalleDto> ventasDetalleDtos= new ArrayList<>();
        List<VentaEntity> ventas = ventaRepository.findAllByFechaBetween(inicio, fin);
        reporteDto.setNumeroTransacciones(ventas.size());
        double totalIngresos = 0.0;

        for(VentaEntity venta : ventas){
            totalIngresos += venta.getTotalVenta();
            ReporteVentaDetalleDto reporteVentaDetalleDto = new ReporteVentaDetalleDto();
            reporteVentaDetalleDto.setVentaDto(ventaMapper.toDTO(venta,productoMapper));
            ventasDetalleDtos.add(reporteVentaDetalleDto);
        }
        reporteDto.setTotalIngresos(totalIngresos);
        reporteDto.setVentas(ventasDetalleDtos);

     return reporteDto;
    }
}
