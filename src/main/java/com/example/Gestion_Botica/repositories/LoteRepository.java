package com.example.Gestion_Botica.repositories;

import com.example.Gestion_Botica.entities.Lote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LoteRepository extends JpaRepository<Lote, Integer> {

    @Query("SELECT l FROM Lote l " +
           "LEFT JOIN FETCH l.producto " +
           "LEFT JOIN FETCH l.detalleCompra dc " +
           "LEFT JOIN FETCH dc.compra c " +
           "LEFT JOIN FETCH c.proveedor")
    List<Lote> listarLotesConTodo();
}