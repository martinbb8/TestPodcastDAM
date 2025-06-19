// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { SubjectsComponent } from './subjects/subjects';
import { TestComponent } from './test/test';
import { PodcastComponent } from './podcast/podcast'; // ¡Importa el nuevo PodcastComponent!

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  // Redirecciones para las rutas generales de tests y podcasts a la lista de asignaturas
  { path: 'tests', redirectTo: '/subjects/test', pathMatch: 'full' },
  { path: 'podcasts', redirectTo: '/subjects/podcast', pathMatch: 'full' },

  // Ruta para el componente SubjectsComponent, que muestra la lista de asignaturas
  { path: 'subjects/:type', component: SubjectsComponent },

  // Ruta para cargar el TestComponent con el nombre de la asignatura
  { path: 'test/:subjectName', component: TestComponent },

  // ¡NUEVA RUTA! Para cargar el PodcastComponent con el nombre de la asignatura
  { path: 'podcast/:subjectName', component: PodcastComponent },

  // Ruta wildcard para cualquier otra URL, redirige al inicio
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];
