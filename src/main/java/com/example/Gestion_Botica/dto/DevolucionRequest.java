package com.example.Gestion_Botica.dto;

import lombok.Data;

@Data
public class DevolucionRequest {
    private Integer ventaId;
    private Integer loteId;
    private Integer usuarioId;
    private Integer cantidad;
    private String motivo;
}
