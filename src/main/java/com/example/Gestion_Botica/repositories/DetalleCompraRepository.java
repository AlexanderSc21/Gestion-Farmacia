package com.example.Gestion_Botica.repositories;

import com.example.Gestion_Botica.entities.DetalleCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleCompraRepository extends JpaRepository<DetalleCompra, Integer> {
}
