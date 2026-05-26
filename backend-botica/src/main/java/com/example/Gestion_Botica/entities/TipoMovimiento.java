package com.example.Gestion_Botica.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "tipos_movimiento")
public class TipoMovimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer tipo_mov_id;

    @Column(nullable = false)
    private String nombre;

    // Getters y Setters
    public Integer getTipo_mov_id() { return tipo_mov_id; }
    public void setTipo_mov_id(Integer tipo_mov_id) { this.tipo_mov_id = tipo_mov_id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}
