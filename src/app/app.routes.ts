// src/app/app.routes.ts
import { Routes } from '@angular/router';

// Importaciones de tus componentes existentes (según tus nombres de archivo .ts)
import { HomeComponent } from './home/home';
import { SubjectsComponent } from './subjects/subjects';
import { TestComponent } from './test/test';
import { PodcastComponent } from './podcast/podcast';

// *** NUEVAS IMPORTACIONES para PDF y Vídeo ***
// Asumimos que tus archivos de componentes se llaman 'pdf-viewer.ts' y 'video-player.ts'
// dentro de sus respectivas carpetas.
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer'; // Importa PdfViewerComponent
import { VideoPlayerComponent } from './video-player/video-player'; // Importa VideoPlayerComponent

export const routes: Routes = [
  // Redirige la ruta raíz a /home
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  // Redirecciones para las rutas generales a la lista de asignaturas específicas
  { path: 'tests', redirectTo: '/subjects/test', pathMatch: 'full' },
  { path: 'podcasts', redirectTo: '/subjects/podcast', pathMatch: 'full' },
  // *** NUEVAS REDIRECCIONES para Vídeos y PDFs ***
  { path: 'videos', redirectTo: '/subjects/video', pathMatch: 'full' },
  { path: 'pdfs', redirectTo: '/subjects/pdf', pathMatch: 'full' },


  // Ruta para el componente SubjectsComponent, que muestra la lista de asignaturas
  // El parámetro ':type' determinará si es para 'test', 'podcast', 'video' o 'pdf'.
  { path: 'subjects/:type', component: SubjectsComponent },

  // Rutas parametrizadas para cargar componentes específicos con el nombre de la asignatura
  { path: 'test/:subjectName', component: TestComponent },
  { path: 'podcast/:subjectName', component: PodcastComponent },
  // *** NUEVAS RUTAS PARAMETRIZADAS para Vídeos y PDFs ***
  { path: 'video/:subjectName', component: VideoPlayerComponent }, // Ej. /video/Historia
  { path: 'pdf/:subjectName', component: PdfViewerComponent },     // Ej. /pdf/Ciencias


  // Ruta comodín: cualquier otra URL no definida redirige al inicio.
  // Debe ser la última ruta en la lista.
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];