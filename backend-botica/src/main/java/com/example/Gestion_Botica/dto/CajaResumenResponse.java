package com.example.Gestion_Botica.dto;

import java.math.BigDecimal;

public class CajaResumenResponse {
    private BigDecimal ingresos;
    private BigDecimal egresos;
    private BigDecimal saldoCaja;

    // Getters y Setters
    public BigDecimal getIngresos() { return ingresos; }
    public void setIngresos(BigDecimal ingresos) { this.ingresos = ingresos; }

    public BigDecimal getEgresos() { return egresos; }
    public void setEgresos(BigDecimal egresos) { this.egresos = egresos; }

    public BigDecimal getSaldoCaja() { return saldoCaja; }
    public void setSaldoCaja(BigDecimal saldoCaja) { this.saldoCaja = saldoCaja; }
}
