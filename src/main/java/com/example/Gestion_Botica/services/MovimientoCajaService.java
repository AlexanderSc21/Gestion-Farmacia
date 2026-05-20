package com.example.Gestion_Botica.services;

import com.example.Gestion_Botica.dto.CajaResumenResponse;
import com.example.Gestion_Botica.entities.MovimientoCaja;
import com.example.Gestion_Botica.entities.TipoMovimiento;
import com.example.Gestion_Botica.entities.Usuario;
import com.example.Gestion_Botica.repositories.MovimientoCajaRepository;
import com.example.Gestion_Botica.repositories.TipoMovimientoRepository;
import com.example.Gestion_Botica.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class MovimientoCajaService {

    @Autowired private MovimientoCajaRepository movimientoCajaRepository;
    @Autowired private TipoMovimientoRepository tipoMovimientoRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    // Listar todos los movimientos del día de hoy
    public List<MovimientoCaja> listarMovimientosDeHoy() {
        LocalDateTime inicioDia = LocalDate.now().atStartOfDay();
        LocalDateTime finDia = LocalDate.now().atTime(LocalTime.MAX);
        
        // Usamos una consulta predeterminada filtrando en memoria o puedes crear un método en el repo.
        // Para simplificar, traeremos todos y los filtraremos por la fecha de hoy.
        return movimientoCajaRepository.findAll().stream()
                .filter(m -> m.getFechaMovimiento().isAfter(inicioDia) && m.getFechaMovimiento().isBefore(finDia))
                .toList();
    }

    // Calcular el Arqueo / Resumen de Dinero de Hoy
    public CajaResumenResponse obtenerResumenHoy() {
        List<MovimientoCaja> movimientos = listarMovimientosDeHoy();
        
        BigDecimal ingresos = BigDecimal.ZERO;
        BigDecimal egresos = BigDecimal.ZERO;

        for (MovimientoCaja m : movimientos) {
            int tipoId = m.getTipoMovimiento().getTipo_mov_id();
            
            // Evaluamos según tus IDs de base de datos:
            // 1: APERTURA, 2: INGRESO POR VENTA
            if (tipoId == 1 || tipoId == 2) {
                ingresos = ingresos.add(m.getMonto());
            } 
            // 3: EGRESO POR COMPRA, 4: DEVOLUCIÓN, 5: CIERRE
            else if (tipoId == 3 || tipoId == 4 || tipoId == 5) {
                egresos = egresos.add(m.getMonto());
            }
        }

        CajaResumenResponse resumen = new CajaResumenResponse();
        resumen.setIngresos(ingresos);
        resumen.setEgresos(egresos);
        resumen.setSaldoCaja(ingresos.subtract(egresos)); // Saldo = Ingresos - Egresos
        
        return resumen;
    }

    // Registrar un movimiento manual (Apertura inicial, Gasto menor, etc.)
    @Transactional
    public MovimientoCaja registrarMovimientoManual(Integer tipoMovId, BigDecimal monto, String descripcion, Integer usuarioId) {
        TipoMovimiento tipo = tipoMovimientoRepository.findById(tipoMovId)
                .orElseThrow(() -> new RuntimeException("Tipo de movimiento no válido"));
                
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        MovimientoCaja mov = new MovimientoCaja();
        mov.setTipoMovimiento(tipo);
        mov.setMonto(monto);
        mov.setDescripcion(descripcion);
        mov.setUsuario(usuario);
        mov.setFechaMovimiento(LocalDateTime.now());

        return movimientoCajaRepository.save(mov);
    }
}
