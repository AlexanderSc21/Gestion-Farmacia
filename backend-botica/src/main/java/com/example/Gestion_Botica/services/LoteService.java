package com.example.Gestion_Botica.services;

import com.example.Gestion_Botica.dto.LoteResponse;
import com.example.Gestion_Botica.entities.Lote;
import com.example.Gestion_Botica.repositories.LoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <--- NUEVA IMPORTACIÓN

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoteService {

    @Autowired
    private LoteRepository loteRepository;

    @Transactional(readOnly = true) // <--- BLINDAJE AGREGADO AQUÍ
    public List<LoteResponse> listarLotes() {
        
        // Asegúrate de que esta línea esté llamando a listarLotesConTodo()
        List<Lote> lotes = loteRepository.listarLotesConTodo();

        return lotes.stream().map(lote -> {
            LoteResponse dto = new LoteResponse();
            dto.setLote_id(lote.getLote_id());
            dto.setCodigoLote(lote.getCodigoLote());
            dto.setFechaIngreso(lote.getFechaIngreso());
            dto.setFechaVencimiento(lote.getFechaVencimiento());
            dto.setCantidadActual(lote.getCantidadActual());
            
            dto.setNombreProducto(lote.getProducto().getNombreComercial());
            dto.setPresentacionProducto(lote.getProducto().getPresentacion());
            
            dto.setNroFactura(lote.getDetalleCompra().getCompra().getNroFactura());
            dto.setNombreProveedor(lote.getDetalleCompra().getCompra().getProveedor().getRazonSocial());
            dto.setPrecioVenta(lote.getProducto().getPrecioVentaUnitario());
            dto.setImagenUrl(lote.getProducto().getImagenUrl());
            if (lote.getProducto().getCategoria() != null) {
                dto.setCategoriaNombre(lote.getProducto().getCategoria().getNombre());
            } else {
                dto.setCategoriaNombre("Sin Categoría");
            }
            
            return dto;
        }).collect(Collectors.toList());
    }
}