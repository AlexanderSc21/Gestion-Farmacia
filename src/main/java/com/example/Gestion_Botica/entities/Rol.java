package com.example.Gestion_Botica.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "roles")
@Data
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer rol_id;

    @Column(nullable = false, unique = true)
    private String nombre;

    private String descripcion;
}
