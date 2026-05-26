package com.example.Gestion_Botica.controllers;

import com.example.Gestion_Botica.dto.LoteResponse;
import com.example.Gestion_Botica.services.LoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lotes")
@CrossOrigin(origins = "http://localhost:4202") 
public class LoteController {

    @Autowired
    private LoteService loteService;

    @GetMapping("/listar")
    public List<LoteResponse> listar() {
        return loteService.listarLotes();
    }
}