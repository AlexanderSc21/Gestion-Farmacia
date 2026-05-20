package com.example.Gestion_Botica.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class VentaRequest {
    private Integer usuarioId;
    private String nroComprobante;
    private String metodoPago;
    private BigDecimal total;
    private List<DetalleVentaRequest> detalles;
}
