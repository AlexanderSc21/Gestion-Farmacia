package com.example.Gestion_Botica.repositories;

import com.example.Gestion_Botica.entities.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Integer> {
    // Hereda todas las operaciones CRUD básicas de fábrica
}