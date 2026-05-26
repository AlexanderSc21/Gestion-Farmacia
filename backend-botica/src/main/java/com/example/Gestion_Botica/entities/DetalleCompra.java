package com.example.Gestion_Botica.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "detalle_compras")
public class DetalleCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer detalle_compra_id;

    @ManyToOne
    @JoinColumn(name = "compra_id", nullable = false)
    private Compra compra;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(name = "cantidad_comprada", nullable = false)
    private Integer cantidadComprada;

    @Column(name = "precio_compra_unitario", nullable = false)
    private BigDecimal precioCompraUnitario;

    @Column(nullable = false)
    private BigDecimal subtotal;

    // Getters y Setters
    public Integer getDetalle_compra_id() { return detalle_compra_id; }
    public void setDetalle_compra_id(Integer detalle_compra_id) { this.detalle_compra_id = detalle_compra_id; }

    public Compra getCompra() { return compra; }
    public void setCompra(Compra compra) { this.compra = compra; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }

    public Integer getCantidadComprada() { return cantidadComprada; }
    public void setCantidadComprada(Integer cantidadComprada) { this.cantidadComprada = cantidadComprada; }

    public BigDecimal getPrecioCompraUnitario() { return precioCompraUnitario; }
    public void setPrecioCompraUnitario(BigDecimal precioCompraUnitario) { this.precioCompraUnitario = precioCompraUnitario; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}
