// src/app/podcast/podcast.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button'; // Módulo para los botones de Material Design

// Interfaz para definir la estructura de un podcast
export interface Podcast {
  id: number;
  title: string;
  description: string;
  audioUrl: string; // Ruta al archivo de audio (MP3)
  transcript: string;
  summary: string;
  keyPoints: string[];
}

@Component({
  selector: 'app-podcast',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule, // Necesario para cargar el JSON de podcasts
    MatButtonModule   // Para los botones de navegación (Anterior, Siguiente)
  ],
  templateUrl: './podcast.html',
  styleUrls: ['./podcast.css']
})
export class PodcastComponent implements OnInit {
  subjectName: string | null = null; // Nombre de la asignatura codificado de la URL
  displaySubjectName: string | null = null; // Nombre de la asignatura decodificado para mostrar
  allPodcasts: Podcast[] = []; // Array que contendrá todos los podcasts de la asignatura
  currentPodcastIndex: number = 0; // Índice del podcast actual que se está reproduciendo/mostrando
  currentPodcast: Podcast | undefined; // El objeto del podcast actual

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient // Inyecta HttpClient para hacer peticiones HTTP
  ) {}

  ngOnInit(): void {
    // Suscribirse a los parámetros de la URL para obtener el nombre de la asignatura
    this.route.paramMap.subscribe(params => {
      const encodedSubjectName = params.get('subjectName'); // Obtiene el nombre codificado (ej. "Digitalizaci%C3%B3n%20Aplicada")
      if (encodedSubjectName) {
        this.subjectName = encodedSubjectName;
        // Decodifica el nombre para mostrarlo correctamente en la interfaz
        this.displaySubjectName = decodeURIComponent(encodedSubjectName);
        this.loadPodcastsForSubject(this.displaySubjectName); // Carga los podcasts de esa asignatura
      } else {
        console.error('No se ha proporcionado el nombre de la asignatura para el podcast.');
        // Si no se proporciona el nombre, redirige al inicio o a una página de error
        this.router.navigate(['/home']);
      }
    });
  }

  // Carga el array de podcasts desde un archivo JSON según la asignatura
  loadPodcastsForSubject(subject: string): void {
    let jsonFileName: string;

    // Determina qué archivo JSON cargar basándose en el nombre de la asignatura
    switch (subject) {
      case 'Digitalización Aplicada':
        jsonFileName = 'digitalizacion-aplicada-podcasts.json';
        break;
      case 'Acceso a Datos': // Si en el futuro tienes podcasts de Acceso a Datos
        jsonFileName = 'acceso-datos-podcasts.json';
        break;
      case 'Aulanova': // Si en el futuro tienes podcasts de Aulanova
        jsonFileName = 'aulanova-podcasts.json';
        break;
      default:
        console.warn(`No hay archivo JSON de podcasts configurado para la asignatura: ${subject}`);
        this.allPodcasts = []; // Vacía el array si no hay datos
        this.currentPodcast = undefined;
        this.router.navigate(['/home']); // Redirige si la asignatura no tiene podcasts
        return;
    }

    // Realiza la petición HTTP GET para obtener los datos del JSON
    this.http.get<Podcast[]>(`/assets/data/${jsonFileName}`).subscribe({
      next: (data) => {
        this.allPodcasts = data; // Almacena todos los podcasts cargados
        this.currentPodcastIndex = 0; // Reinicia el índice al cargar
        this.setPodcast(this.currentPodcastIndex); // Establece el primer podcast por defecto
      },
      error: (err) => {
        console.error(`Error al cargar los podcasts para ${subject}:`, err);
        this.router.navigate(['/home']); // Redirige a inicio en caso de error de carga
      }
    });
  }

  // Establece el podcast actual según el índice proporcionado
  setPodcast(index: number): void {
    // Asegura que el índice esté dentro de los límites válidos del array
    if (index >= 0 && index < this.allPodcasts.length) {
      this.currentPodcastIndex = index;
      this.currentPodcast = this.allPodcasts[this.currentPodcastIndex];
    }
  }

  // Navega al podcast anterior en la lista
  previousPodcast(): void {
    if (this.currentPodcastIndex > 0) {
      this.setPodcast(this.currentPodcastIndex - 1);
    }
  }

  // Navega al podcast siguiente en la lista
  nextPodcast(): void {
    if (this.currentPodcastIndex < this.allPodcasts.length - 1) {
      this.setPodcast(this.currentPodcastIndex + 1);
    }
  }

  // Navega de vuelta a la lista de asignaturas en modo "podcast"
  goToSubjects(): void {
    this.router.navigate(['/subjects', 'podcast']);
  }
}
