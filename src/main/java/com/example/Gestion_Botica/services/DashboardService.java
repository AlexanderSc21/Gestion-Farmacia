package com.example.Gestion_Botica.services;

import com.example.Gestion_Botica.dto.DashboardDTO;
import com.example.Gestion_Botica.repositories.UsuarioRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public DashboardDTO obtenerResumen() {
        // 1. Calcular ingresos de hoy
        Query qIngresos = entityManager.createNativeQuery(
            "SELECT COALESCE(SUM(total), 0) FROM ventas WHERE DATE(fecha_venta AT TIME ZONE 'America/Lima') = CURRENT_DATE"); // <-- ¡Cambiado a total!
        Double ingresosHoy = ((Number) qIngresos.getSingleResult()).doubleValue();

        // 2. Calcular stock total de productos (suma de todos los lotes)
        Query qStock = entityManager.createNativeQuery("SELECT SUM(cantidad_actual) FROM lotes");
        Long stockTotal = ((Number) qStock.getSingleResult()).longValue();

        // 3. Contar tickets de hoy
        Query qTickets = entityManager.createNativeQuery(
            "SELECT COUNT(*) FROM ventas WHERE DATE(fecha_venta) = CURRENT_DATE");
        Long ticketsHoy = ((Number) qTickets.getSingleResult()).longValue();

        // 4. Usuarios activos (usando tu repositorio existente)
        Long usuariosActivos = usuarioRepository.countByActivo(true);

        // 5. Ventas de los últimos 7 días (para el gráfico)
        Query qGrafico = entityManager.createNativeQuery(
            "SELECT TO_CHAR(fecha_venta AT TIME ZONE 'America/Lima', 'YYYY-MM-DD') as fecha, SUM(total) " +
            "FROM ventas " +
            "WHERE (fecha_venta AT TIME ZONE 'America/Lima') >= CURRENT_DATE - INTERVAL '7 days' " +
            "GROUP BY fecha ORDER BY fecha ASC");
        
        List<Object[]> resultadosGrafico = qGrafico.getResultList();
        Map<String, Double> ventasSemana = new LinkedHashMap<>();
        for (Object[] row : resultadosGrafico) {
            ventasSemana.put(row[0].toString(), ((Number) row[1]).doubleValue());
        }

        return new DashboardDTO(ingresosHoy, stockTotal, ticketsHoy, usuariosActivos, ventasSemana);
    }
}
