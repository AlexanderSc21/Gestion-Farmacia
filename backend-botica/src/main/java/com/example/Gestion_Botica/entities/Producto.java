package com.example.Gestion_Botica.entities;
import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "productos")
@Data
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer producto_id;

    @Column(name = "nombre_comercial", nullable = false)
    private String nombreComercial;

    @Column(name = "imagen_path")
    private String imagenPath;

    @Column(name = "imagen_url")
    private String imagenUrl;

    @Column(name = "nombre_generico")
    private String nombreGenerico;

    @Column(nullable = false)
    private String presentacion;

    @Column(name = "precio_venta_unitario", nullable = false)
    private BigDecimal precioVentaUnitario;

    @Column(name = "stock_minimo")
    private Integer stockMinimo;

    // Relación ManyToOne con la tabla de Categorías
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
}