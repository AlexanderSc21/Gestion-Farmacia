import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovimientoCajaService } from '../../services/movimiento-caja.service';
import { MovimientoCaja } from '../../models/models';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caja.component.html'
})
export class CajaComponent implements OnInit {
  resumen = { ingresos: 0, egresos: 0, saldoCaja: 0 };
  movimientos: MovimientoCaja[] = [];

  nuevoMovimiento: any = {
    tipoMovId: 1,
    monto: 0,
    descripcion: '',
    usuarioId: 1
  };

  constructor(private cajaService: MovimientoCajaService) {}

  ngOnInit(): void {
    this.cargarDatosCaja();
  }

  cargarDatosCaja() {
    this.cajaService.obtenerResumen().subscribe(data => {
      this.resumen = data;
    });

    this.cajaService.listar().subscribe(data => {
      this.movimientos = data.sort((a, b) => 
        new Date(b.fechaMovimiento).getTime() - new Date(a.fechaMovimiento).getTime()
      );
    });
  }

  registrarMovimiento() {
    if (!this.nuevoMovimiento.monto || this.nuevoMovimiento.monto <= 0) {
      alert('Por favor, ingrese un monto válido.');
      return;
    }
    if (!this.nuevoMovimiento.descripcion.trim()) {
      alert('La descripción es obligatoria.');
      return;
    }

    this.cajaService.registrar(this.nuevoMovimiento).subscribe({
      next: () => {
        alert('Movimiento registrado con éxito.');
        this.cargarDatosCaja();
        this.nuevoMovimiento.monto = 0;
        this.nuevoMovimiento.descripcion = '';
        this.nuevoMovimiento.tipoMovId = 1;
      },
      error: (err) => {
        alert('Error al registrar el movimiento.');
        console.error(err);
      }
    });
  }
}
