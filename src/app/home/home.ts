// src/app/home/home.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importa el Router para la navegación programática
import { MatButtonModule } from '@angular/material/button'; // Para los botones de Material Design

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule // Asegúrate de que MatButtonModule esté importado
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  // Inyecta el servicio Router en el constructor
  constructor(private router: Router) { }

  // Nueva función para navegar a la lista de asignaturas (tests o podcasts)
  goToSubjects(type: 'test' | 'podcast'): void {
    // Navega a la ruta '/subjects' pasando el tipo ('test' o 'podcast') como parámetro
    this.router.navigate(['/subjects', type]);
      }
}