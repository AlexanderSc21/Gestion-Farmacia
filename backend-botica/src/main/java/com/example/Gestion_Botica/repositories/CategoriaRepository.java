package com.example.Gestion_Botica.repositories;

import com.example.Gestion_Botica.entities.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    // Por ahora, JpaRepository nos da todo lo que necesitamos de fábrica
}
