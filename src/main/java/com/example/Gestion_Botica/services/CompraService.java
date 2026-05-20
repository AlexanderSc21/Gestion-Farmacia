package com.example.Gestion_Botica.services;

import com.example.Gestion_Botica.dto.CompraRequest;
import com.example.Gestion_Botica.dto.DetalleCompraRequest;
import com.example.Gestion_Botica.entities.*;
import com.example.Gestion_Botica.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CompraService {

    @Autowired private CompraRepository compraRepository;
    @Autowired private DetalleCompraRepository detalleCompraRepository;
    @Autowired private LoteRepository loteRepository;
    @Autowired private ProveedorRepository proveedorRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private ProductoRepository productoRepository;

    @Transactional // ¡Punto clave para la seguridad de los datos!
    public Compra registrarCompraCompleta(CompraRequest request) {
        
        // 1. Buscamos al Proveedor y al Usuario en la BD
        Proveedor proveedor = proveedorRepository.findById(request.getProveedorId())
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Creamos y guardamos la Cabecera de la Compra (La Factura)
        Compra compra = new Compra();
        compra.setNroFactura(request.getNroFactura());
        compra.setMontoTotal(request.getMontoTotal());
        compra.setProveedor(proveedor);
        compra.setUsuario(usuario);
        compra.setFechaCompra(LocalDateTime.now());
        compra.setEstadoCompra("COMPLETADO");
        
        Compra compraGuardada = compraRepository.save(compra);

        // 3. Recorremos la lista de medicamentos comprados
        for (DetalleCompraRequest detReq : request.getDetalles()) {
            Producto producto = productoRepository.findById(detReq.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            // A. Guardamos el Detalle de la compra
            DetalleCompra detalle = new DetalleCompra();
            detalle.setCompra(compraGuardada);
            detalle.setProducto(producto);
            detalle.setCantidadComprada(detReq.getCantidad());
            detalle.setPrecioCompraUnitario(detReq.getPrecioUnitario());
            
            // Calculamos el subtotal (Cantidad * Precio)
            BigDecimal subtotal = detReq.getPrecioUnitario().multiply(new BigDecimal(detReq.getCantidad()));
            detalle.setSubtotal(subtotal);
            
            DetalleCompra detalleGuardado = detalleCompraRepository.save(detalle);

            // B. ¡MAGIA! Creamos el Lote físico automáticamente
            Lote lote = new Lote();
            lote.setProducto(producto);
            lote.setDetalleCompra(detalleGuardado);
            lote.setCantidadActual(detReq.getCantidad()); // El stock inicial es lo que compramos
            lote.setFechaVencimiento(detReq.getFechaVencimiento());
            
            // Generamos un código de lote único (ej. LOTE-Paracetamol-1234)
            String codigoGenerado = "LOTE-" + producto.getProducto_id() + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
            lote.setCodigoLote(codigoGenerado);
            
            loteRepository.save(lote);
        }

        return compraGuardada;
    }
}
