// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Módulo con directivas comunes como ngIf, ngFor
import { RouterOutlet } from '@angular/router'; // Directiva necesaria para el enrutamiento

@Component({
  // El selector 'app-root' es la etiqueta HTML que se usa para insertar este componente
  // en el archivo 'index.html' (por ejemplo, <app-root></app-root>).
  selector: 'app-root',
  // Indica que este componente es autónomo (standalone), lo que significa que
  // puede ser usado sin necesidad de declararse en un NgModule.
  standalone: true,
  // Aquí se importan otros módulos o componentes que este componente necesita.
  // CommonModule es fundamental para usar directivas básicas de Angular.
  // RouterOutlet es necesario para que el enrutador de Angular pueda mostrar
  // el componente de la ruta activa dentro de este AppComponent.
  imports: [CommonModule, RouterOutlet],
  // Ruta al archivo de plantilla HTML de este componente.
  templateUrl: './app.html',
  // Rutas a los archivos de estilos CSS/SCSS de este componente.
  styleUrl: './app.css'
})
export class AppComponent {
  // Aquí puedes definir propiedades o métodos para tu componente.
  // Por ejemplo, un título para la aplicación:
  title = 'mi-aplicacion-angular';
}