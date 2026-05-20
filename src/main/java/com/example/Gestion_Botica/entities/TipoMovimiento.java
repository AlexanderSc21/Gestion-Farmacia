package com.example.Gestion_Botica.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tipos_movimiento")
@Data
public class TipoMovimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer tipo_mov_id;

    @Column(nullable = false)
    private String nombre; // Ej: APERTURA, INGRESO_VENTA, SALIDA_GASTO, CIERRE
}