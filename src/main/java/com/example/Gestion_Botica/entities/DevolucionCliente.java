package com.example.Gestion_Botica.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "devoluciones_cliente")
@Data
public class DevolucionCliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer dev_cliente_id;

    @ManyToOne
    @JoinColumn(name = "venta_id", nullable = false)
    private Venta venta;

    @ManyToOne
    @JoinColumn(name = "lote_id", nullable = false)
    private Lote lote;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario; // El administrador/cajero que autorizó la devolución

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private String motivo;

    @Column(nullable = false)
    private String estado = "PROCESADO"; // Para saber si ya se devolvió el dinero y stock

    @Column(name = "fecha_devolucion")
    private LocalDateTime fechaDevolucion = LocalDateTime.now();
}
