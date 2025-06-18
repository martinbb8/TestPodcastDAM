// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { SubjectsComponent } from './subjects/subjects';
import { TestComponent } from './test/test'; // Importa el nuevo TestComponent

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  // Las rutas /tests y /podcasts ahora redirigen a /subjects con un parámetro 'type'
  { path: 'tests', redirectTo: '/subjects/test', pathMatch: 'full' },
  { path: 'podcasts', redirectTo: '/subjects/podcast', pathMatch: 'full' },

  // Esta ruta es para SubjectsComponent, que toma un parámetro 'type'
  { path: 'subjects/:type', component: SubjectsComponent },

  // NUEVA RUTA: para cargar el TestComponent con el nombre de la asignatura
  { path: 'test/:subjectName', component: TestComponent },

  // Futura ruta para podcasts específicos
  // { path: 'podcast/:subjectName', component: PodcastPlayerComponent },

  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];
