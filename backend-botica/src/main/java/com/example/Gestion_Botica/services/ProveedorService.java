package com.example.Gestion_Botica.services;

import com.example.Gestion_Botica.entities.Proveedor;
import com.example.Gestion_Botica.repositories.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    // Listar todos los proveedores
    public List<Proveedor> listarProveedores() {
        return proveedorRepository.findAll();
    }

    // Registrar un nuevo proveedor
    public Proveedor registrarProveedor(Proveedor proveedor) {
        return proveedorRepository.save(proveedor);
    }

    // Actualizar un proveedor existente
    public Proveedor actualizarProveedor(Integer id, Proveedor proveedorActualizado) {
        return proveedorRepository.findById(id).map(proveedor -> {
            proveedor.setRuc(proveedorActualizado.getRuc());
            proveedor.setRazonSocial(proveedorActualizado.getRazonSocial());
            proveedor.setTelefono(proveedorActualizado.getTelefono());
            proveedor.setEmail(proveedorActualizado.getEmail());
            proveedor.setDireccion(proveedorActualizado.getDireccion());
            // No actualizamos el estado 'activo' aquí por seguridad
            return proveedorRepository.save(proveedor);
        }).orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
    }

    // Método reutilizable para Activar o Desactivar (Baja Lógica)
    public void cambiarEstadoProveedor(Integer id, boolean estado) {
        proveedorRepository.findById(id).ifPresent(proveedor -> {
            proveedor.setActivo(estado);
            proveedorRepository.save(proveedor);
        });
    }
}
