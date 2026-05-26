package com.example.Gestion_Botica.dto;

import java.math.BigDecimal;
import java.util.List;

public class CompraRequest {
    private Integer proveedorId;
    private Integer usuarioId;
    private String nroFactura;
    private BigDecimal montoTotal;
    private List<DetalleCompraRequest> detalles;

    // Getters y Setters
    public Integer getProveedorId() { return proveedorId; }
    public void setProveedorId(Integer proveedorId) { this.proveedorId = proveedorId; }

    public Integer getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }

    public String getNroFactura() { return nroFactura; }
    public void setNroFactura(String nroFactura) { this.nroFactura = nroFactura; }

    public BigDecimal getMontoTotal() { return montoTotal; }
    public void setMontoTotal(BigDecimal montoTotal) { this.montoTotal = montoTotal; }

    public List<DetalleCompraRequest> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleCompraRequest> detalles) { this.detalles = detalles; }
}
