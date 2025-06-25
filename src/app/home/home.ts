// src/app/home/home.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router'; // Importa el Router para la navegación programática
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Para modales de Material
import { TestComponent } from '../test/test'; // Importa TestComponent para el modal

// -------------------- INICIO MODIFICACIÓN --------------------
// Importamos MatCardModule para que Angular reconozca las etiquetas <mat-card> en home.html
import { MatCardModule } from '@angular/material/card';
// -------------------- FIN MODIFICACIÓN --------------------

// Interfaz para definir la estructura de una asignatura
interface Subject {
  name: string;
  id: string; // Un ID único para la asignatura si lo necesitas para rutas internas o data
  type: 'test' | 'podcast' | 'pdf' | 'video'; // Añadimos el tipo de contenido
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule, // Asegúrate de que MatButtonModule esté importado
    MatDialogModule, // Asegúrate de que MatDialogModule esté importado
    // -------------------- INICIO MODIFICACIÓN --------------------
    MatCardModule    // Asegúrate de que MatCardModule esté importado aquí
    // -------------------- FIN MODIFICACIÓN --------------------
  ],
  templateUrl: './home.html', // Apunta a la plantilla HTML de esta página de inicio
  styleUrls: ['./home.css']  // Apunta a los estilos CSS de esta página de inicio
})
export class HomeComponent implements OnInit {
  // Lista de asignaturas que se mostrarán en la página de inicio
  subjects: Subject[] = [
    { name: 'Digitalización Aplicada', id: 'digitalizacion-aplicada', type: 'video' },
    { name: 'Acceso a Datos', id: 'acceso-a-datos', type: 'video' },
    { name: 'Aulanova', id: 'aulanova', type: 'podcast' },
    { name: 'Programación multimedia y dispositivos móviles', id: 'programacion-multimedia', type: 'video' },
    { name: 'Desarrollo de interfaces', id: 'desarrollo-interfaces', type: 'video' },
    { name: 'Sistemas de gestión empresarial', id: 'sistemas-gestion', type: 'video' },
    { name: 'Itinerario para la empleabilidad II', id: 'itinerario-empleabilidad', type: 'test' },
    { name: 'Proyecto de desarrollo de aplicaciones multiplataforma', id: 'proyecto-multiplataforma', type: 'video' },
    { name: 'Sostenibilidad aplicada al sistema productivo', id: 'sostenibilidad', type: 'video' }
  ];

  // Inyecta los servicios Router y MatDialog en el constructor
  constructor(
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Lógica de inicialización si es necesaria
  }

  /**
   * Abre el contenido (test, podcast, pdf, video) para una asignatura específica.
   * Dependiendo del contentType, navegará a la ruta correspondiente o abrirá un modal.
   * @param subjectName El nombre completo de la asignatura.
   * @param contentType El tipo de contenido a abrir ('test', 'podcast', 'pdf', 'video').
   */
  openContent(subjectName: string, contentType: 'test' | 'podcast' | 'pdf' | 'video'): void {
    // Codifica el nombre de la asignatura para la URL, ya que puede contener espacios o caracteres especiales
    const encodedSubjectName = encodeURIComponent(subjectName);

    switch (contentType) {
      case 'test':
        // Si es un test, abrimos el TestComponent como un modal
        this.openTestModal(encodedSubjectName);
        break;
      case 'podcast':
        // Si es un podcast, navegamos a la ruta del PodcastComponent
        this.router.navigate(['/podcast', encodedSubjectName]);
        break;
      case 'pdf':
        // Si es un PDF, navegamos a la ruta del PdfViewerComponent (asumiendo que existe)
        this.router.navigate(['/pdf', encodedSubjectName]);
        break;
      case 'video':
        // Si es un vídeo, navegamos a la ruta del VideoPlayerComponent.
        console.log(`Navegando a videos de: ${subjectName} (ruta: /video/${encodedSubjectName})`);
        this.router.navigate(['/video', encodedSubjectName]);
        break;
      default:
        console.warn('Tipo de contenido no reconocido:', contentType);
        break;
    }
  }

  /**
   * Abre el TestComponent como un modal.
   * @param subjectName El nombre codificado de la asignatura que se pasará al TestComponent.
   */
  openTestModal(subjectName: string): void {
    this.dialog.open(TestComponent, {
      width: '90%',    // Ancho del modal
      maxWidth: '1000px', // Ancho máximo
      height: '90%',    // Alto del modal
      data: { subjectName: subjectName }, // Pasamos el nombre codificado de la asignatura al modal
      disableClose: true // Opcional: El usuario no puede cerrar haciendo clic fuera o con Esc
    });
  }
}