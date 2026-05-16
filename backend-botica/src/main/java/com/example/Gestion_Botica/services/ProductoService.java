package com.example.Gestion_Botica.services;

import com.example.Gestion_Botica.entities.Producto;
import com.example.Gestion_Botica.repositories.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    // Método para listar todos los productos con su categoría incluida
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    // Método para guardar o registrar un nuevo producto
    public Producto registrarProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    // Método para actualizar un producto existente
    public Producto actualizarProducto(Integer id, Producto productoActualizado) {
        return productoRepository.findById(id).map(productoExistente -> {
            // Actualizamos los campos uno por uno
            productoExistente.setNombreComercial(productoActualizado.getNombreComercial());
            productoExistente.setNombreGenerico(productoActualizado.getNombreGenerico());
            productoExistente.setPresentacion(productoActualizado.getPresentacion());
            productoExistente.setPrecioVentaUnitario(productoActualizado.getPrecioVentaUnitario());
            productoExistente.setStockMinimo(productoActualizado.getStockMinimo());
            productoExistente.setImagenUrl(productoActualizado.getImagenUrl());
            productoExistente.setCategoria(productoActualizado.getCategoria());
            
            return productoRepository.save(productoExistente);
        }).orElseThrow(() -> new RuntimeException("Producto no encontrado con el ID: " + id));
    }

    // Método para eliminar un producto
    public void eliminarProducto(Integer id) {
        productoRepository.deleteById(id);
    }
}
