package com.example.Gestion_Botica.services;

import com.example.Gestion_Botica.dto.DevolucionRequest;
import com.example.Gestion_Botica.entities.*;
import com.example.Gestion_Botica.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class DevolucionClienteService {

    @Autowired private DevolucionClienteRepository devolucionRepository;
    @Autowired private VentaRepository ventaRepository;
    @Autowired private DetalleVentaRepository detalleVentaRepository;
    @Autowired private LoteRepository loteRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private MovimientoCajaRepository movimientoCajaRepository;
    @Autowired private TipoMovimientoRepository tipoMovimientoRepository;

    @Transactional
    public DevolucionCliente procesarDevolucion(DevolucionRequest request) {
        
        // 1. Validar existencias
        Venta venta = ventaRepository.findById(request.getVentaId())
                .orElseThrow(() -> new RuntimeException("La venta no existe"));
        Lote lote = loteRepository.findById(request.getLoteId())
                .orElseThrow(() -> new RuntimeException("El lote no existe"));
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Buscar si ese producto realmente se vendió en ese ticket
        DetalleVenta detalle = detalleVentaRepository.findAll().stream()
                .filter(d -> d.getVenta().getVenta_id().equals(venta.getVenta_id()) && 
                             d.getLote().getLote_id().equals(lote.getLote_id()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Ese medicamento no pertenece a este ticket de venta"));

        // Validar que no devuelva más de lo que compró
        if (request.getCantidad() > detalle.getCantidad()) {
            throw new RuntimeException("No puede devolver más unidades de las que compró.");
        }

        // 3. REGRESAR STOCK AL ESTANTE
        lote.setCantidadActual(lote.getCantidadActual() + request.getCantidad());
        loteRepository.save(lote);

        // 4. RETIRAR DINERO DE LA CAJA (Reembolso)
        // Calculamos cuánto dinero devolver (cantidad devuelta * precio al que se le vendió)
        BigDecimal montoReembolso = detalle.getPrecioUnitario().multiply(new BigDecimal(request.getCantidad()));
        
        TipoMovimiento tipoDevolucion = tipoMovimientoRepository.findById(4) // 4 = DEVOLUCIÓN
                .orElseThrow(() -> new RuntimeException("Tipo de Movimiento 'Devolución' no configurado"));

        MovimientoCaja egreso = new MovimientoCaja();
        egreso.setTipoMovimiento(tipoDevolucion);
        egreso.setMonto(montoReembolso);
        egreso.setDescripcion("Devolución Venta " + venta.getNroComprobante() + " - Motivo: " + request.getMotivo());
        egreso.setUsuario(usuario);
        egreso.setFechaMovimiento(LocalDateTime.now());
        egreso.setReferenciaId(venta.getVenta_id());
        egreso.setReferenciaTipo("DEVOLUCION_CLIENTE");
        movimientoCajaRepository.save(egreso);

        // 5. REGISTRAR LA DEVOLUCIÓN COMO TAL
        DevolucionCliente devolucion = new DevolucionCliente();
        devolucion.setVenta(venta);
        devolucion.setLote(lote);
        devolucion.setUsuario(usuario);
        devolucion.setCantidad(request.getCantidad());
        devolucion.setMotivo(request.getMotivo());
        
        return devolucionRepository.save(devolucion);
    }
}
