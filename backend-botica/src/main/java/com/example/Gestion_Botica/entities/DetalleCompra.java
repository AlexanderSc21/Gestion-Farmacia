package com.example.Gestion_Botica.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "detalle_compras")
@Data
public class DetalleCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer detalle_compra_id;

    // Relación: Este detalle pertenece a una Compra específica
    @ManyToOne
    @JoinColumn(name = "compra_id", nullable = false)
    private Compra compra;

    // Relación: El medicamento específico que estamos comprando
    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(name = "cantidad_comprada", nullable = false)
    private Integer cantidadComprada;

    @Column(name = "precio_compra_unitario", nullable = false)
    private BigDecimal precioCompraUnitario; // A cuánto nos vendió el laboratorio

    @Column(nullable = false)
    private BigDecimal subtotal; // cantidad_comprada * precio_compra_unitario
}
