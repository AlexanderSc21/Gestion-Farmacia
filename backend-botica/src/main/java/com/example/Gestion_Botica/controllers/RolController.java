package com.example.Gestion_Botica.controllers;

import com.example.Gestion_Botica.entities.Rol;
import com.example.Gestion_Botica.repositories.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles") // Esta será la URL base
public class RolController {

    @Autowired
    private RolRepository rolRepository;

    @GetMapping
    public List<Rol> listarRoles() {
        // Este método usa el repositorio para traer todo de Supabase
        return rolRepository.findAll();
    }
}