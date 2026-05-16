package com.example.Gestion_Botica.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer usuario_id;

    @Column(nullable = false)
    private String nombre_completo;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password_hash; // Aquí guardaremos la clave

    private Boolean activo = true;

    @ManyToOne(fetch = FetchType.EAGER)// Relación con la tabla de Roles
    @JoinColumn(name = "rol_id")
    private Rol rol;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
