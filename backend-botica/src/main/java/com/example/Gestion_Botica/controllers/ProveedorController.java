package com.example.Gestion_Botica.controllers;

import com.example.Gestion_Botica.entities.Proveedor;
import com.example.Gestion_Botica.services.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "http://localhost:4200")
public class ProveedorController {

    @Autowired
    private ProveedorService proveedorService;

    @GetMapping("/listar")
    public List<Proveedor> listar() {
        return proveedorService.listarProveedores();
    }

    @PostMapping("/registro")
    public Proveedor registrar(@RequestBody Proveedor proveedor) {
        return proveedorService.registrarProveedor(proveedor);
    }

    @PutMapping("/actualizar/{id}")
    public Proveedor actualizar(@PathVariable Integer id, @RequestBody Proveedor proveedor) {
        return proveedorService.actualizarProveedor(id, proveedor);
    }

    @PatchMapping("/desactivar/{id}")
    public void desactivar(@PathVariable Integer id) {
        proveedorService.cambiarEstadoProveedor(id, false);
    }

    @PatchMapping("/activar/{id}")
    public void activar(@PathVariable Integer id) {
        proveedorService.cambiarEstadoProveedor(id, true);
    }
}
