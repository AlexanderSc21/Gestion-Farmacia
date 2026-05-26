package com.example.Gestion_Botica.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer rol_id;

    @Column(nullable = false, unique = true)
    private String nombre;

    private String descripcion;

    // Getters y Setters
    public Integer getRol_id() { return rol_id; }
    public void setRol_id(Integer rol_id) { this.rol_id = rol_id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
