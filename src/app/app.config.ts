// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router'; // Importamos provideRouter para configurar el enrutamiento
import { provideHttpClient } from '@angular/common/http'; // Importamos provideHttpClient para usar HttpClient en la app

import { routes } from './app.routes'; // Importamos el array de rutas que definiremos en app.routes.ts

// Definimos la configuración global de nuestra aplicación Angular.
// Aquí se proveen los servicios y funcionalidades principales.
export const appConfig: ApplicationConfig = {
  providers: [
    // Provee el sistema de enrutamiento a toda la aplicación,
    // utilizando las rutas definidas en el archivo 'app.routes.ts'.
    provideRouter(routes),
    // Provee el servicio HttpClient a toda la aplicación.
    // Esto permite que los componentes y servicios realicen peticiones HTTP.
    provideHttpClient()
    // Si necesitas soporte para animaciones de Angular Material, podrías añadir:
    // provideAnimations()
  ]
};