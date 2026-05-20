package com.example.Gestion_Botica.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat; // <--- NUEVA IMPORTACIÓN
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class LoteResponse {
    private Integer lote_id;
    private String codigoLote;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaIngreso;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaVencimiento;
    
    private Integer cantidadActual;
    
    private String nombreProducto;
    private String presentacionProducto;
    private String nroFactura;
    private String nombreProveedor;
    private java.math.BigDecimal precioVenta;
    private String imagenUrl;
    private String categoriaNombre;
}