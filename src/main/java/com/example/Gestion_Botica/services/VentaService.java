package com.example.Gestion_Botica.services;

import com.example.Gestion_Botica.dto.VentaRequest;
import com.example.Gestion_Botica.dto.DetalleVentaRequest;
import com.example.Gestion_Botica.entities.*;
import com.example.Gestion_Botica.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class VentaService {

    @Autowired private VentaRepository ventaRepository;
    @Autowired private DetalleVentaRepository detalleVentaRepository;
    @Autowired private LoteRepository loteRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    
    // NUEVOS REPOSITORIOS INYECTADOS
    @Autowired private MovimientoCajaRepository movimientoCajaRepository;
    @Autowired private TipoMovimientoRepository tipoMovimientoRepository;

    @Transactional
    public Venta registrarVentaCompleta(VentaRequest request) {
        
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario ejecutor no encontrado"));

        Venta venta = new Venta();
        venta.setNroComprobante(request.getNroComprobante());
        venta.setMetodoPago(request.getMetodoPago());
        venta.setTotal(request.getTotal());
        venta.setUsuario(usuario);
        venta.setFechaVenta(LocalDateTime.now());

        Venta ventaGuardada = ventaRepository.save(venta);

        for (DetalleVentaRequest detReq : request.getDetalles()) {
            Lote lote = loteRepository.findById(detReq.getLoteId())
                    .orElseThrow(() -> new RuntimeException("El lote especificado no existe"));

            if (lote.getCantidadActual() < detReq.getCantidad()) {
                throw new RuntimeException("Stock insuficiente en el lote " + lote.getCodigoLote());
            }

            lote.setCantidadActual(lote.getCantidadActual() - detReq.getCantidad());
            loteRepository.save(lote);

            DetalleVenta detalle = new DetalleVenta();
            detalle.setVenta(ventaGuardada);
            detalle.setLote(lote);
            detalle.setCantidad(detReq.getCantidad());
            detalle.setPrecioUnitario(detReq.getPrecioUnitario());
            
            BigDecimal subtotal = detReq.getPrecioUnitario().multiply(new BigDecimal(detReq.getCantidad()));
            detalle.setSubtotal(subtotal);

            detalleVentaRepository.save(detalle);
        }

        // =========================================================
        // ¡NUEVO!: REGISTRO AUTOMÁTICO EN LA CAJA CHICA
        // =========================================================
        
        // Buscamos el tipo de movimiento 2 ("INGRESO POR VENTA")
        TipoMovimiento tipoVenta = tipoMovimientoRepository.findById(2)
                .orElseThrow(() -> new RuntimeException("Tipo de Movimiento no configurado en BD"));

        MovimientoCaja ingresoCaja = new MovimientoCaja();
        ingresoCaja.setTipoMovimiento(tipoVenta);
        ingresoCaja.setMonto(ventaGuardada.getTotal()); // El total del ticket
        ingresoCaja.setDescripcion("Venta Ticket " + ventaGuardada.getNroComprobante() + " - " + ventaGuardada.getMetodoPago());
        ingresoCaja.setUsuario(usuario);
        ingresoCaja.setFechaMovimiento(LocalDateTime.now());
        
        // Rastreabilidad: Guardamos de qué venta exacta vino este dinero
        ingresoCaja.setReferenciaId(ventaGuardada.getVenta_id());
        ingresoCaja.setReferenciaTipo("VENTA");

        movimientoCajaRepository.save(ingresoCaja);

        return ventaGuardada;
    }
}