package com.example.Gestion_Botica.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DetalleVentaRequest {
    private Integer loteId;
    private Integer cantidad;
    private BigDecimal precioUnitario;
}
