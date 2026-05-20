package com.example.Gestion_Botica.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DetalleCompraRequest {
    private Integer productoId;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private LocalDate fechaVencimiento; // Dato vital para crear el Lote
}
