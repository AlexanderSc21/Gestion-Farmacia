package com.example.Gestion_Botica.controllers;

import com.example.Gestion_Botica.dto.VentaRequest;
import com.example.Gestion_Botica.entities.DetalleVenta;
import com.example.Gestion_Botica.entities.Venta;
import com.example.Gestion_Botica.repositories.DetalleVentaRepository;
import com.example.Gestion_Botica.repositories.VentaRepository;
import com.example.Gestion_Botica.services.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "http://localhost:4202")
public class VentaController {

    @Autowired private VentaService ventaService;
    
    // Agregamos los repositorios para hacer la búsqueda rápida
    @Autowired private VentaRepository ventaRepository;
    @Autowired private DetalleVentaRepository detalleVentaRepository;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarVenta(@RequestBody VentaRequest request) {
        try {
            Venta nuevaVenta = ventaService.registrarVentaCompleta(request);
            return ResponseEntity.ok(nuevaVenta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==========================================
    // NUEVO: BUSCADOR DE TICKET PARA DEVOLUCIONES
    // ==========================================
    @GetMapping("/buscar/{nroComprobante}")
    public ResponseEntity<?> buscarVentaPorTicket(@PathVariable String nroComprobante) {
        try {
            // 1. Buscamos la cabecera de la venta
            Venta venta = ventaRepository.findAll().stream()
                    .filter(v -> v.getNroComprobante().equalsIgnoreCase(nroComprobante))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No se encontró el comprobante: " + nroComprobante));

            // 2. Buscamos los detalles (qué medicinas compró en ese ticket)
            List<DetalleVenta> detalles = detalleVentaRepository.findAll().stream()
                    .filter(d -> d.getVenta().getVenta_id().equals(venta.getVenta_id()))
                    .collect(Collectors.toList());

            // 3. Empaquetamos todo y lo enviamos a Angular
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("venta", venta);
            respuesta.put("detalles", detalles);

            return ResponseEntity.ok(respuesta);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}