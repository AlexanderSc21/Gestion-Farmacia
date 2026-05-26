package com.example.Gestion_Botica.dto;

import java.math.BigDecimal;

public class DetalleVentaRequest {
    private Integer loteId;
    private Integer cantidad;
    private BigDecimal precioUnitario;

    // Getters y Setters
    public Integer getLoteId() { return loteId; }
    public void setLoteId(Integer loteId) { this.loteId = loteId; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
}
