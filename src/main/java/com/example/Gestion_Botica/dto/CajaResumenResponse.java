package com.example.Gestion_Botica.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CajaResumenResponse {
    private BigDecimal ingresos;
    private BigDecimal egresos;
    private BigDecimal saldoCaja;
}
