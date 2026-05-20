package com.example.Gestion_Botica.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CompraRequest {
    private Integer proveedorId;
    private Integer usuarioId; // El admin que está registrando
    private String nroFactura;
    private BigDecimal montoTotal;
    private List<DetalleCompraRequest> detalles; // La lista de medicamentos
}