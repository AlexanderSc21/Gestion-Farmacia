package com.example.Gestion_Botica.services;

import com.example.Gestion_Botica.entities.Usuario;
import com.example.Gestion_Botica.repositories.UsuarioRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Usuario registrarUsuario(Usuario usuario) {
    // Aquí podrías validar si el email ya existe antes de guardar
        // 1. Tomamos la clave en texto plano (ej: "123456")
        String passwordPlano = usuario.getPassword_hash();
        
        // 2. La encriptamos usando BCrypt
        String passwordEncriptada = passwordEncoder.encode(passwordPlano);
        
        // 3. Reemplazamos la clave original por la segura
        usuario.setPassword_hash(passwordEncriptada);
        
        // 4. Guardamos en Supabase
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarUsuarios() {
    return usuarioRepository.findAll(); 
}

public void desactivarUsuario(Integer id) {
    // Buscamos al usuario por su ID, si existe cambiamos su estado y guardamos
    usuarioRepository.findById(id).ifPresent(usuario -> {
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    });
}

public void activarUsuario(Integer id) {
    usuarioRepository.findById(id).ifPresent(usuario -> {
        usuario.setActivo(true); // <--- Aquí encendemos el interruptor
        usuarioRepository.save(usuario);
    });
}

public Usuario actualizarUsuario(Integer id, Usuario usuarioActualizado) {
    return usuarioRepository.findById(id).map(usuarioExistente -> {
        // Actualizamos los campos permitidos
        usuarioExistente.setNombre_completo(usuarioActualizado.getNombre_completo());
        usuarioExistente.setEmail(usuarioActualizado.getEmail());
        usuarioExistente.setRol(usuarioActualizado.getRol());
        
        // NOTA: La contraseña no la tocamos aquí para no romper la encriptación por accidente
        
        return usuarioRepository.save(usuarioExistente);
    }).orElseThrow(() -> new RuntimeException("Usuario no encontrado con el ID: " + id));
}

}
