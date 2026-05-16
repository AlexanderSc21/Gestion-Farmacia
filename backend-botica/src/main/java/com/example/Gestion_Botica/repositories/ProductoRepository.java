package com.example.Gestion_Botica.repositories;

import com.example.Gestion_Botica.entities.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    // JpaRepository nos dará las funciones de guardar, listar, editar y eliminar productos de fábrica
}