// src/app/pdf-viewer/pdf-viewer.ts

// Este componente Angular está diseñado para mostrar documentos PDF.
// Ahora utilizará un iframe para una visualización básica y compatible con cualquier versión de Angular.
// Permite la navegación entre PDFs cargados desde un archivo JSON.

// --- Importaciones de Angular y librerías necesarias ---
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Importar DomSanitizer

// ¡IMPORTANTE! Eliminamos la importación de NgxExtendedPdfViewerModule
// import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';


// --- Definición de Interfaz de Datos ---
interface PdfItem {
  id: number;
  title: string;
  pdfUrl: string; // Mantenemos 'pdfUrl' para que coincida con tu JSON.
}

// --- Decorador @Component ---
@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.html',
  styleUrls: ['./pdf-viewer.css'],
  standalone: true,
  imports: [
    CommonModule,
    // ¡IMPORTANTE! Eliminamos NgxExtendedPdfViewerModule de los imports
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdfViewerComponent implements OnInit, OnDestroy {
  displaySubjectName: string = 'Digitalización Aplicada';
  allPdfs: PdfItem[] = [];
  currentPdf: PdfItem | null = null;
  currentPdfIndex: number = 0;
  errorMessage: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null; // Variable para la URL segura del PDF

  private httpSubscription: Subscription | undefined;
  private routeSubscription: Subscription | undefined;

  constructor(
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer // Inyectar DomSanitizer
  ) {
    console.log('PdfViewerComponent: Constructor ejecutado.');
  }

  // --- Ciclo de Vida: ngOnInit ---
  ngOnInit(): void {
    console.log('PdfViewerComponent: ngOnInit ejecutado. Leyendo parámetros de ruta...');
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const subjectName = params.get('subjectName');
      if (subjectName) {
        this.displaySubjectName = decodeURIComponent(subjectName);
        console.log(`PdfViewerComponent: Subject Name recibido: ${this.displaySubjectName}`);
        this.loadPdfs(this.displaySubjectName);
      } else {
        this.errorMessage = 'No se ha especificado el nombre de la asignatura para cargar los PDFs.';
        console.warn('PdfViewerComponent: No subjectName found in route params.');
        this.cdRef.detectChanges();
      }
    });
  }

  /**
   * Carga los PDFs desde un archivo JSON basado en el nombre de la asignatura.
   * @param subjectName El nombre de la asignatura para construir la ruta del JSON.
   */
  private loadPdfs(subjectName: string): void {
    this.errorMessage = null;
    const jsonPath = `/assets/data/digitalizacion-aplicada-pdfs.json`;
    console.log(`Intentando cargar PDFs desde: ${jsonPath}`);

    this.httpSubscription = this.http.get<PdfItem[]>(jsonPath)
      .pipe(
        catchError(error => {
          console.error('Error al cargar el archivo de PDFs:', error);
          this.errorMessage = `Error al cargar los PDFs para "${subjectName}".
                                Verifique el archivo ${jsonPath} y su accesibilidad.`;
          this.cdRef.detectChanges();
          return EMPTY;
        })
      )
      .subscribe(data => {
        if (data && data.length > 0) {
          this.allPdfs = data;
          this.currentPdfIndex = 0;
          this.setCurrentPdf(this.currentPdfIndex);
          this.errorMessage = null;
          console.log('PDFs cargados exitosamente:', this.allPdfs);
        } else {
          this.allPdfs = [];
          this.currentPdf = null;
          this.errorMessage = `El archivo de PDFs para "${subjectName}" está vacío o no tiene la estructura esperada.`;
          console.warn(this.errorMessage);
        }
        this.cdRef.detectChanges();
      });
  }

  /**
   * Establece el PDF actual a mostrar y prepara su URL para el visor.
   * Utiliza DomSanitizer para marcar la URL como segura.
   * @param index El índice del PDF dentro del array 'allPdfs'.
   */
  setCurrentPdf(index: number): void {
    if (index >= 0 && index < this.allPdfs.length) {
      this.currentPdfIndex = index;
      this.currentPdf = this.allPdfs[this.currentPdfIndex];
      // Sanear la URL para que Angular la considere segura en un iframe
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentPdf.pdfUrl);

      this.errorMessage = null;
      console.log(`PDF establecido: "${this.currentPdf.title}", URL: ${this.currentPdf.pdfUrl}`);
    } else {
      this.currentPdf = null;
      this.safePdfUrl = null;
      this.errorMessage = 'Índice de PDF fuera de rango o no hay PDFs disponibles.';
      console.warn('Índice de PDF fuera de rango.');
    }
    this.cdRef.detectChanges();
  }

  /**
   * Avanza al siguiente PDF en la lista, si existe.
   */
  nextPdf(): void {
    if (this.currentPdfIndex < this.allPdfs.length - 1) {
      this.setCurrentPdf(this.currentPdfIndex + 1);
    }
  }

  /**
   * Retrocede al PDF anterior en la lista, si existe.
   */
  previousPdf(): void {
    if (this.currentPdfIndex > 0) {
      this.setCurrentPdf(this.currentPdfIndex - 1);
    }
  }

  /**
   * Navega de vuelta a la página de inicio o a una ruta específica.
   */
  goToHome(): void {
    this.router.navigate(['/home']);
    console.log('Navegar a /home desde PdfViewerComponent');
  }

  // --- Ciclo de Vida: ngOnDestroy ---
  ngOnDestroy(): void {
    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    console.log('PdfViewerComponent: ngOnDestroy ejecutado. Suscripciones desuscritas.');
  }
}