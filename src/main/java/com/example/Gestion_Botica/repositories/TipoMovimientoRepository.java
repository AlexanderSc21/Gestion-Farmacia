package com.example.Gestion_Botica.repositories;

import com.example.Gestion_Botica.entities.TipoMovimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoMovimientoRepository extends JpaRepository<TipoMovimiento, Integer> {
}
