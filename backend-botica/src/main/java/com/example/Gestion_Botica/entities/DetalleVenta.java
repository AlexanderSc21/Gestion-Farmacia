package com.example.Gestion_Botica.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "detalle_ventas")
@Data
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer detalle_id;

    // A qué ticket de venta pertenece este ítem
    @ManyToOne
    @JoinColumn(name = "venta_id", nullable = false)
    private Venta venta;

    // ¡CRÍTICO! De qué lote físico exacto estamos sacando la medicina
    @ManyToOne
    @JoinColumn(name = "lote_id", nullable = false)
    private Lote lote;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false)
    private BigDecimal precioUnitario; // El precio al que se lo vendimos al cliente

    @Column(nullable = false)
    private BigDecimal subtotal; // cantidad * precio_unitario
}
