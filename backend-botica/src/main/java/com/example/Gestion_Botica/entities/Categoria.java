package com.example.Gestion_Botica.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "categorias")
@Data
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoria_id;

    @Column(nullable = false, unique = true)
    private String nombre;

    private String descripcion;
}