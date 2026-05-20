package com.example.Gestion_Botica.controllers;

import com.example.Gestion_Botica.dto.DevolucionRequest;
import com.example.Gestion_Botica.entities.DevolucionCliente;
import com.example.Gestion_Botica.services.DevolucionClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/devoluciones")
@CrossOrigin(origins = "http://localhost:4200")
public class DevolucionClienteController {

    @Autowired
    private DevolucionClienteService devolucionService;

    @PostMapping("/procesar")
    public ResponseEntity<?> procesarDevolucion(@RequestBody DevolucionRequest request) {
        try {
            DevolucionCliente nuevaDevolucion = devolucionService.procesarDevolucion(request);
            return ResponseEntity.ok(nuevaDevolucion);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error en devolución: " + e.getMessage());
        }
    }
}
