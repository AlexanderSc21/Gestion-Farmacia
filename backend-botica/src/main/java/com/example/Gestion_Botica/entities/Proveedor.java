package com.example.Gestion_Botica.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "proveedores")
@Data
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer proveedor_id;

    @Column(nullable = false, unique = true)
    private String ruc;

    @Column(name = "razon_social", nullable = false)
    private String razonSocial;

    private String telefono;

    private String email;

    private String direccion;

    @Column(nullable = false)
    private Boolean activo = true; // Por defecto el proveedor entra activo
}
