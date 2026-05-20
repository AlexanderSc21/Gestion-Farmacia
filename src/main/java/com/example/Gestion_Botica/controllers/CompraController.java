package com.example.Gestion_Botica.controllers;

import com.example.Gestion_Botica.dto.CompraRequest;
import com.example.Gestion_Botica.entities.Compra;
import com.example.Gestion_Botica.services.CompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compras")
@CrossOrigin(origins = "http://localhost:4200")
public class CompraController {

    @Autowired
    private CompraService compraService;

    @PostMapping("/registrar")
    public ResponseEntity<Compra> registrarCompra(@RequestBody CompraRequest request) {
        Compra nuevaCompra = compraService.registrarCompraCompleta(request);
        return ResponseEntity.ok(nuevaCompra);
    }
}
