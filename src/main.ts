// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // ¡Importante! Importa la configuración completa.
import { AppComponent } from './app/app';   // Importa el componente raíz.

// Arranca la aplicación utilizando el componente raíz (AppComponent)
// y la configuración completa de la aplicación (appConfig).
// Esto asegura que todos los proveedores definidos en app.config.ts estén disponibles.
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));