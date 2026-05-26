import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/models';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.component.html'
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  nuevaCategoria: Categoria = { nombre: '', descripcion: '' };

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.categoriaService.listar().subscribe(data => this.categorias = data);
  }

  registrar() {
    if (this.nuevaCategoria.nombre) {
      this.categoriaService.registrar(this.nuevaCategoria).subscribe({
        next: () => {
          alert('Categoría registrada con éxito');
          this.nuevaCategoria = { nombre: '', descripcion: '' };
          this.obtenerCategorias();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
