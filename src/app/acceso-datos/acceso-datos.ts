// src/app/acceso-datos/acceso-datos.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas comunes de Angular

@Component({
  selector: 'app-acceso-datos',
  standalone: true, // ¡IMPORTANTE! Este componente debe ser standalone
  imports: [CommonModule], // Añade CommonModule si vas a usar *ngIf, *ngFor, etc.
  template: `
    <div class="content-card">
      <h2>Acceso a Datos</h2>
      <p>Este es el contenido del componente de Acceso a Datos.</p>
      <img src="https://placehold.co/400x200/ff9800/ffffff?text=Datos" alt="Acceso a Datos" class="content-image">
    </div>
  `,
  styles: [`
    .content-card {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 25px;
      margin-top: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
      width: 80%;
      max-width: 600px;
      font-family: 'Inter', sans-serif;
    }
    h2 {
      color: #ff9800;
      margin-bottom: 15px;
    }
    p {
      color: #555;
      line-height: 1.6;
    }
    .content-image {
        max-width: 100%;
        height: auto;
        border-radius: 6px;
        margin-top: 20px;
    }
    @media (max-width: 768px) {
        .content-card {
            width: 95%;
            padding: 15px;
        }
    }
  `]
})
export class AccesoDatosComponent { }

