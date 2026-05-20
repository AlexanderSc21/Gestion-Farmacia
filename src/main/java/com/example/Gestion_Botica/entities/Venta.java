package com.example.Gestion_Botica.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ventas")
@Data
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer venta_id;

    @Column(name = "fecha_venta")
    private LocalDateTime fechaVenta = LocalDateTime.now();

    // ¡NUEVO! Número de boleta o factura (ej. B001-000123)
    @Column(name = "nro_comprobante", nullable = false)
    private String nroComprobante;

    // ¡NUEVO! Efectivo, Tarjeta Visa, Yape, Plin, etc.
    @Column(name = "metodo_pago", nullable = false)
    private String metodoPago;

    // Ajustado para coincidir exactamente con el nombre de tu tabla ('total')
    @Column(name = "total", nullable = false)
    private BigDecimal total;

    // Relación: Qué empleado (Vendedor/Admin) realizó esta venta
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
}
