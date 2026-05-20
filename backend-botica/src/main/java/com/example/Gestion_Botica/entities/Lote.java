package com.example.Gestion_Botica.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lotes")
@Data
public class Lote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer lote_id;

    @Column(name = "codigo_lote", nullable = false)
    private String codigoLote; // Ej: "LOTE-20260516-001"

    @Column(name = "fecha_ingreso")
    private LocalDateTime fechaIngreso = LocalDateTime.now();

    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDate fechaVencimiento;

    @Column(name = "cantidad_actual", nullable = false)
    private Integer cantidadActual; // Este número irá bajando cuando se venda

    // Relación: De qué medicamento es este lote
    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    // Relación: De qué compra exacta provino este lote
    @ManyToOne
    @JoinColumn(name = "detalle_compra_id", nullable = false)
    private DetalleCompra detalleCompra;
}
