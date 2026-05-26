import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ProveedorService } from '../../services/proveedor.service';
import { ProductoService } from '../../services/producto.service';
import { CompraService } from '../../services/compra.service';
import { Proveedor, Producto } from '../../models/models';

@Component({
  selector: 'app-compra-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './compra-registro.component.html'
})
export class CompraRegistroComponent implements OnInit {
  proveedores: Proveedor[] = [];
  productos: Producto[] = [];

  compra: any = {
    proveedorId: null,
    usuarioId: 1,
    nroFactura: '',
    montoTotal: 0,
    detalles: [] as any[]
  };

  itemTemp: any = {
    productoId: null,
    cantidad: 0,
    precioUnitario: 0,
    fechaVencimiento: ''
  };

  constructor(
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private compraService: CompraService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarProductos();
  }

  cargarProveedores() {
    this.proveedorService.listar().subscribe(data => {
      this.proveedores = data.filter(p => p.activo === true);
    });
  }

  cargarProductos() {
    this.productoService.listar().subscribe(data => {
      this.productos = data;
    });
  }

  agregarItem() {
    if (!this.itemTemp.productoId || !this.itemTemp.cantidad || !this.itemTemp.precioUnitario || !this.itemTemp.fechaVencimiento) {
      alert('Por favor, complete todos los datos del medicamento.');
      return;
    }

    const prodSeleccionado = this.productos.find(p => p.producto_id === Number(this.itemTemp.productoId));
    const subtotalCalc = this.itemTemp.cantidad * this.itemTemp.precioUnitario;

    this.compra.detalles.push({
      productoId: Number(this.itemTemp.productoId),
      nombreProducto: prodSeleccionado?.nombreComercial,
      cantidad: this.itemTemp.cantidad,
      precioUnitario: this.itemTemp.precioUnitario,
      fechaVencimiento: this.itemTemp.fechaVencimiento,
      subtotal: subtotalCalc
    });

    this.calcularTotal();
    this.itemTemp = { productoId: null, cantidad: 0, precioUnitario: 0, fechaVencimiento: '' };
  }

  quitarItem(index: number) {
    this.compra.detalles.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.compra.montoTotal = this.compra.detalles.reduce((acc: number, item: any) => acc + item.subtotal, 0);
  }

  registrarCompra() {
    if (!this.compra.proveedorId || !this.compra.nroFactura) {
      alert('Faltan los datos de la factura (Proveedor o Número).');
      return;
    }
    if (this.compra.detalles.length === 0) {
      alert('Debe agregar al menos un medicamento a la compra.');
      return;
    }

    this.compraService.registrar(this.compra).subscribe({
      next: () => {
        alert('Compra registrada con éxito. El inventario ha sido actualizado.');
        this.router.navigate(['/lotes']);
      },
      error: (err) => alert('Error al registrar compra: ' + err.message)
    });
  }
}
