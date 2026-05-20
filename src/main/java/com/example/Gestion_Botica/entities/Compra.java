package com.example.Gestion_Botica.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "compras")
@Data
public class Compra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer compra_id;

    @Column(name = "nro_factura", nullable = false)
    private String nroFactura;

    @Column(name = "fecha_compra")
    private LocalDateTime fechaCompra = LocalDateTime.now(); // Se pone la fecha actual por defecto

    @Column(name = "monto_total", nullable = false)
    private BigDecimal montoTotal;

    @Column(name = "estado_compra")
    private String estadoCompra = "COMPLETADO"; // Puede ser COMPLETADO, ANULADO, etc.

    // Relación: Una compra pertenece a un Proveedor
    @ManyToOne
    @JoinColumn(name = "proveedor_id", nullable = false)
    private Proveedor proveedor;

    // Relación: Una compra es registrada por un Usuario (Administrador)
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
}
