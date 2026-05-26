package com.example.Gestion_Botica.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "categorias")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoria_id;

    @Column(nullable = false, unique = true)
    private String nombre;

    private String descripcion;

    // Getters y Setters
    public Integer getCategoria_id() { return categoria_id; }
    public void setCategoria_id(Integer categoria_id) { this.categoria_id = categoria_id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
