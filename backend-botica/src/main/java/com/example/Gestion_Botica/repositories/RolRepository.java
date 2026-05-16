package com.example.Gestion_Botica.repositories;

import com.example.Gestion_Botica.entities.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {
    // JpaRepository ya trae métodos como findAll(), save(), delete(), etc.
}
