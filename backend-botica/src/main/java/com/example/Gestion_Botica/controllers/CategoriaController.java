package com.example.Gestion_Botica.controllers;

import com.example.Gestion_Botica.entities.Categoria;
import com.example.Gestion_Botica.services.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "http://localhost:4202")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping("/listar")
    public List<Categoria> listar() {
        return categoriaService.listarCategorias();
    }

    @PostMapping("/registro")
    public Categoria registrar(@RequestBody Categoria categoria) {
        return categoriaService.registrarCategoria(categoria);
    }
}