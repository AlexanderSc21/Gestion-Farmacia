package com.example.Gestion_Botica.controllers;

import com.example.Gestion_Botica.services.UsuarioService;
import com.example.Gestion_Botica.entities.Usuario;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200") // Permite que Angular se conecte
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registro")
    public Usuario registrar(@RequestBody Usuario usuario) {
        // El controlador recibe los datos y los pasa al servicio
        // La "magia" de la encriptación ocurrirá dentro de registrarUsuario
        return usuarioService.registrarUsuario(usuario);
    }

    // Listar todos los usuarios
    @GetMapping("/listar")
    public List<Usuario> listarTodos() {
        return usuarioService.listarUsuarios();
    }

    // Actualizar un usuario existente

    @PutMapping("/actualizar/{id}")
    public Usuario actualizar(@PathVariable Integer id, @RequestBody Usuario usuario) {
        return usuarioService.actualizarUsuario(id, usuario);
    }

    // Baja lógica (no borramos de la DB, solo cambiamos el estado 'activo' a false)
    @PatchMapping("/desactivar/{id}")
    public void desactivar(@PathVariable Integer id) {
        usuarioService.desactivarUsuario(id);
    }

    // Reactivar un usuario (cambiar el estado 'activo' a true)
    @PatchMapping("/activar/{id}")
    public void activar(@PathVariable Integer id) {
        usuarioService.activarUsuario(id);
    }
}
