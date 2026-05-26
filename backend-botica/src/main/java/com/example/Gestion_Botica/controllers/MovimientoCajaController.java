package com.example.Gestion_Botica.controllers;

import com.example.Gestion_Botica.dto.CajaResumenResponse;
import com.example.Gestion_Botica.entities.MovimientoCaja;
import com.example.Gestion_Botica.services.MovimientoCajaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/caja")
@CrossOrigin(origins = "http://localhost:4202")
public class MovimientoCajaController {

    @Autowired
    private MovimientoCajaService cajaService;

    @GetMapping("/movimientos")
    public List<MovimientoCaja> getMovimientosHoy() {
        return cajaService.listarMovimientosDeHoy();
    }

    @GetMapping("/resumen")
    public CajaResumenResponse getResumenHoy() {
        return cajaService.obtenerResumenHoy();
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarMovimiento(@RequestBody Map<String, Object> payload) {
        try {
            // SOLUCIÓN: Convertimos de forma segura cualquier formato que envíe Angular a Número entero
            Integer tipoMovId = Integer.parseInt(payload.get("tipoMovId").toString());
            BigDecimal monto = new BigDecimal(payload.get("monto").toString());
            String descripcion = (String) payload.get("descripcion");
            Integer usuarioId = Integer.parseInt(payload.get("usuarioId").toString());

            MovimientoCaja nuevoMov = cajaService.registrarMovimientoManual(tipoMovId, monto, descripcion, usuarioId);
            return ResponseEntity.ok(nuevoMov);
        } catch (Exception e) {
            // Ahora si hay error, te dirá exactamente por qué falló en la consola de Java
            e.printStackTrace(); 
            return ResponseEntity.badRequest().body("Error al registrar movimiento: " + e.getMessage());
        }
    }
}