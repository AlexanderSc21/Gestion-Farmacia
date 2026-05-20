package com.example.Gestion_Botica.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos_caja")
@Data
public class MovimientoCaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer movimiento_id;

    @ManyToOne
    @JoinColumn(name = "tipo_mov_id", nullable = false)
    private TipoMovimiento tipoMovimiento;

    @Column(nullable = false)
    private BigDecimal monto;

    @Column(columnDefinition = "TEXT")
    private String descripcion; // Ej: "Pago de luz", "Venta Ticket B001-123"

    @Column(name = "fecha_movimiento")
    private LocalDateTime fechaMovimiento = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario; // El cajero que registró el movimiento

    // Estos dos campos son opcionales y sirven para enlazar el movimiento con otra tabla (Ej: la tabla ventas)
    @Column(name = "referencia_id")
    private Integer referenciaId;

    @Column(name = "referencia_tipo")
    private String referenciaTipo; // Ej: "VENTA", "COMPRA_PROVEEDOR"
}