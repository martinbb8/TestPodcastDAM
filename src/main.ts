// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router'; // Asegúrate de que esta línea esté
import { provideAnimations } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app';
import { routes } from './app/app.routes'; // Asegúrate de que esta línea esté

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations()
  ]
}).catch(err => console.error(err));
