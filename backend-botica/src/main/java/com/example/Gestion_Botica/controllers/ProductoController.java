package com.example.Gestion_Botica.controllers;

import com.example.Gestion_Botica.entities.Producto;
import com.example.Gestion_Botica.services.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:4200") // Conexión directa con tu Angular
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // Endpoint para obtener la lista de medicamentos
    @GetMapping("/listar")
    public List<Producto> listarTodos() {
        return productoService.listarProductos();
    }

    // Endpoint para registrar un nuevo medicamento
    @PostMapping("/registro")
    public Producto registrar(@RequestBody Producto producto) {
        return productoService.registrarProducto(producto);
    }

    // Endpoint para actualizar un medicamento
    @PutMapping("/actualizar/{id}")
    public Producto actualizar(@PathVariable Integer id, @RequestBody Producto producto) {
        return productoService.actualizarProducto(id, producto);
    }

    // Endpoint para eliminar un medicamento
    @DeleteMapping("/eliminar/{id}")
    public void eliminar(@PathVariable Integer id) {
        productoService.eliminarProducto(id);
    }
}
