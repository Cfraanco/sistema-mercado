package com.mercado.sistemamercado.model.ventasdetalle;

import jakarta.persistence.*;
import com.mercado.sistemamercado.model.ventas.VentaEntity;
import com.mercado.sistemamercado.model.productos.ProductoEntity;

import java.util.UUID;

@Table(name = "ventas_detalle")
@Entity
public class VentaDetalleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "venta_id")
    private VentaEntity venta;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private ProductoEntity producto;

    private int cantidadProducto;

    private double precioTotalxProducto;

    public VentaEntity getVenta() {
        return venta;
    }

    public void setVenta(VentaEntity venta) {
        this.venta = venta;
    }

    public ProductoEntity getProducto() {
        return producto;
    }

    public void setProducto(ProductoEntity producto) {
        this.producto = producto;
    }

    public int getCantidadProducto() {
        return cantidadProducto;
    }

    public void setCantidadProducto(int cantidadProducto) {
        this.cantidadProducto = cantidadProducto;
    }

    public double getPrecioTotalxProducto() {
        return precioTotalxProducto;
    }

    public void setPrecioTotalxProducto(double precioTotalxProducto) {
        this.precioTotalxProducto = precioTotalxProducto;
    }
}
