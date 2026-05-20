package com.example.Gestion_Botica.services;

import com.example.Gestion_Botica.entities.Rol;
import com.example.Gestion_Botica.repositories.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolService {

    @Autowired
    private RolRepository rolRepository;

    public List<Rol> obtenerTodosLosRoles() {
        // Aquí podrías poner lógica adicional en el futuro
        return rolRepository.findAll();
    }
}
