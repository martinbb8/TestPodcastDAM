// src/app/home/home.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Para la navegación con routerLink
import { MatButtonModule } from '@angular/material/button'; // Para los botones de Material

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,     // Importa RouterLink para los botones de navegación
    MatButtonModule // Importa MatButtonModule para los botones de Material
  ],
  templateUrl: './home.html', // Asume home.html
  styleUrls: ['./home.css'] // Asume home.css
})
export class HomeComponent {
  // Ya no necesitas lógica compleja aquí, los botones solo navegan
}