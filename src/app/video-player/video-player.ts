// src/app/video-player/video-player.ts

// Este archivo TypeScript define la lógica y el comportamiento del componente
// encargado de reproducir videos. Para esta prueba, su función principal es:
// 1. Cargar el archivo 'digitalizacion-aplicada-videos.json' al iniciar.
// 2. Mostrar la información del video (título) y el reproductor.

// --- Importaciones de Angular y librerías necesarias ---
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';             // Para realizar peticiones HTTP (cargar el archivo JSON).
import { CommonModule } from '@angular/common';                // Módulo común para directivas como *ngIf, *ngFor.
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Para "sanitizar" URLs y prevenir ataques de seguridad.
import { Subscription, EMPTY } from 'rxjs';                    // Para gestionar las suscripciones y manejar errores de forma limpia.
import { catchError } from 'rxjs/operators';                   // Operador para capturar errores en Observables.
import { MatButtonModule } from '@angular/material/button';    // Para usar los botones de Angular Material.
// Necesitamos ActivatedRoute para leer parámetros de la URL (aunque no se use en esta fase de prueba simplificada,
// es bueno tenerlo si la navegación de HomeComponent lo va a usar para pasar la asignatura).
// También importamos Router si goToHome() va a navegar realmente.
import { ActivatedRoute, Router } from '@angular/router';
// -------------------- INICIO MODIFICACIÓN --------------------
// Importamos HttpClientModule para asegurarnos de que el proveedor de HttpClient esté disponible
// directamente para este componente standalone. Esto es una solución común para el NullInjectorError.
import { HttpClientModule } from '@angular/common/http';
// -------------------- FIN MODIFICACIÓN --------------------

// --- Definición de Interfaz de Datos ---
// Estructura que esperamos de cada objeto video dentro de nuestro JSON.
interface VideoItem {
  id: number;       // Identificador único del video.
  title: string;    // Título del video.
  videoUrl: string; // URL del video (ej. de Vimeo).
}

// --- Decorador @Component ---
// Define este archivo como un componente de Angular.
@Component({
  selector: 'app-video-player',       // Selector CSS para usar este componente en otros templates.
  templateUrl: './video-player.html', // Ruta a la plantilla HTML: 'video-player.html'
  styleUrls: ['./video-player.css'],  // Ruta al archivo CSS de estilos: 'video-player.css'
  standalone: true,                   // Componente independiente, no necesita declararse en un NgModule.
  imports: [                          // Módulos que este componente necesita.
    CommonModule,     // Necesario para directivas estructurales como *ngIf y *ngFor
    MatButtonModule,  // Necesario para los botones de Angular Material
    // -------------------- INICIO MODIFICACIÓN --------------------
    // Añadimos HttpClientModule aquí para proveer HttpClient directamente a este componente standalone.
    HttpClientModule
    // -------------------- FIN MODIFICACIÓN --------------------
  ],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimización para la detección de cambios.
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  // --- Propiedades del Componente ---
  // Estas propiedades almacenarán los datos y el estado del reproductor.
  // El nombre de la asignatura, fijo para esta prueba inicial.
  displaySubjectName: string = 'Digitalización Aplicada';
  allVideos: VideoItem[] = [];           // Array que contendrá todos los videos cargados.
  currentVideo: VideoItem | null = null; // El objeto del video que se está mostrando.
  currentVideoIndex: number = 0;         // El índice del video actual.
  safeVideoUrl: SafeResourceUrl | null = null; // URL del video actual, sanitizada para seguridad.
  errorMessage: string | null = null;    // Mensaje de error para mostrar al usuario.

  // Suscripción para la petición HTTP, para desuscribir en ngOnDestroy.
  private httpSubscription: Subscription | undefined;

  // --- Constructor del Componente ---
  // Inyectamos las dependencias necesarias.
  constructor(
    private http: HttpClient,           // Servicio para cargar el JSON.
    private sanitizer: DomSanitizer,    // Servicio para sanitizar URLs.
    private cdRef: ChangeDetectorRef,   // Para forzar la detección de cambios y actualizar la UI.
    private route: ActivatedRoute,
    private router: Router
  ) {
    // -------------------- INICIO MODIFICACIÓN --------------------
    console.log('VideoPlayerComponent: Constructor ejecutado.');
    // -------------------- FIN MODIFICACIÓN --------------------
  }

  // --- Ciclo de Vida: ngOnInit ---
  // Se ejecuta una vez que el componente ha sido inicializado.
  ngOnInit(): void {
    // -------------------- INICIO MODIFICACIÓN --------------------
    console.log('VideoPlayerComponent: ngOnInit ejecutado.');
    // -------------------- FIN MODIFICACIÓN --------------------
    // Al iniciar el componente, intentamos cargar los videos desde el JSON.
    // Esto es clave para verificar si el reproductor aparece y si el video se carga.
    this.loadVideosForDigitalizacionAplicada();
    console.log('VideoPlayerComponent inicializado. Intentando cargar videos...');
  }

  /**
   * Carga los videos directamente desde el archivo 'digitalizacion-aplicada-videos.json'.
   * Este método es para la prueba simplificada.
   */
  private loadVideosForDigitalizacionAplicada(): void {
    this.errorMessage = null; // Limpiamos cualquier error previo.
    const jsonPath = '/assets/data/digitalizacion-aplicada-videos.json'; // Ruta al JSON que me has indicado.
    console.log(`Intentando cargar videos desde: ${jsonPath}`); // Para depuración.

    // Realizamos la petición HTTP para obtener el archivo JSON.
    this.httpSubscription = this.http.get<VideoItem[]>(jsonPath)
      .pipe(
        // Capturamos cualquier error que ocurra durante la petición HTTP.
        catchError(error => {
          console.error('Error al cargar el archivo de videos:', error);
          this.errorMessage = `No se pudieron cargar los videos para "Digitalización Aplicada".
                               Asegúrate de que el archivo ${jsonPath} exista y sea accesible.
                               También, verifica la Consola del navegador (F12) para más detalles.`;
          this.safeVideoUrl = null; // Asegurarse de no mostrar un iframe roto.
          this.cdRef.detectChanges(); // Forzamos la actualización de la UI para mostrar el error.
          return EMPTY; // Retornamos un Observable vacío para detener la cadena de eventos.
        })
      )
      .subscribe(data => {
        // Se ejecuta cuando la petición HTTP se completa con éxito.
        if (data && data.length > 0) {
          this.allVideos = data;
          this.currentVideoIndex = 0; // Siempre empezamos con el primer video.
          this.setCurrentVideo(this.currentVideoIndex); // Establecemos el video actual.
          this.errorMessage = null; // Limpiamos cualquier mensaje de error.
          console.log('Videos cargados:', this.allVideos); // Para depuración.
        } else {
          // Si el archivo JSON está vacío o no tiene el formato esperado.
          this.allVideos = [];
          this.currentVideo = null;
          this.safeVideoUrl = null;
          this.errorMessage = 'El archivo de videos está vacío o no tiene la estructura esperada.';
          console.warn(this.errorMessage);
        }
        this.cdRef.detectChanges(); // Forzamos la actualización de la UI.
      });
  }

  /**
   * Establece el video actual a mostrar y prepara su URL para el reproductor.
   * @param index El índice del video dentro del array 'allVideos'.
   */
  setCurrentVideo(index: number): void {
    if (index >= 0 && index < this.allVideos.length) {
      this.currentVideoIndex = index;
      this.currentVideo = this.allVideos[this.currentVideoIndex];

      let urlToSanitize: string;
      // Añadimos los parámetros de Vimeo para una mejor experiencia si es un video de Vimeo.
      // Se añade '/video/' para asegurar el formato correcto de la URL de Vimeo.
      if (this.currentVideo.videoUrl.includes('player.vimeo.com/video/')) {
        urlToSanitize = `${this.currentVideo.videoUrl}?byline=0&portrait=0&badge=0`;
      } else if (this.currentVideo.videoUrl.includes('vimeo.com/')) {
        // Si la URL es de Vimeo pero no es una URL de 'player', la transformamos.
        const videoId = this.currentVideo.videoUrl.split('vimeo.com/')[1].split('?')[0].split('#')[0];
        urlToSanitize = `https://player.vimeo.com/video/${videoId}?byline=0&portrait=0&badge=0`;
      } else {
        // Para URLs que no son de Vimeo (ej. archivos MP4 directos), las usamos tal cual.
        urlToSanitize = this.currentVideo.videoUrl;
      }

      // ¡IMPORTANTE! Sanitiza la URL. Esto es crucial por seguridad en Angular
      // para permitir que URLs externas se carguen en elementos como <iframe> o <video>.
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlToSanitize);
      this.errorMessage = null; // Limpiar cualquier mensaje de error anterior.
      console.log(`Video establecido: "${this.currentVideo.title}", URL: ${urlToSanitize}`); // Para depuración.
    } else {
      // Si el índice está fuera de rango, resetear el video y mostrar un error.
      this.currentVideo = null;
      this.safeVideoUrl = null;
      this.errorMessage = 'Índice de video fuera de rango o no hay videos disponibles.';
      console.warn('Índice de video fuera de rango.');
    }
    this.cdRef.detectChanges(); // Forzamos la actualización de la UI.
  }

  /**
   * Avanza al siguiente video en la lista.
   * No hace nada si ya estamos en el último video.
   */
  nextVideo(): void {
    if (this.currentVideoIndex < this.allVideos.length - 1) {
      this.setCurrentVideo(this.currentVideoIndex + 1);
    }
  }

  /**
   * Retrocede al video anterior en la lista.
   * No hace nada si ya estamos en el primer video.
   */
  previousVideo(): void {
    if (this.currentVideoIndex > 0) {
      this.setCurrentVideo(this.currentVideoIndex - 1);
    }
  }

  /**
   * Navega de vuelta a la página de inicio.
   * (Esta función puede necesitar ser ajustada si la navegación es diferente).
   */
  goToHome(): void {
    // Usamos el Router inyectado para navegar a '/home'.
    this.router.navigate(['/home']);
    console.log('Navegar a /home');
  }

  // --- Ciclo de Vida: ngOnDestroy ---
  // Se ejecuta justo antes de que el componente sea destruido.
  // Es crucial para desuscribirse de Observables y prevenir fugas de memoria.
  ngOnDestroy(): void {
    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe(); // Desuscribir la petición HTTP.
    }
    // Si tuvieras más suscripciones (ej. routeSubscription de ActivatedRoute), también se desuscribirían aquí.
  }
}