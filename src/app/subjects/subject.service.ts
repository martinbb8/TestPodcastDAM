// src/app/subject.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private selectedSubjectName: string | null = null; // Nombre original para mostrar
  private subjectNameMap: Map<string, string> = new Map(); // Mapa de nombre limpio -> nombre original

  constructor() {
    // Inicializa el mapa con los nombres de tus asignaturas
    const subjects = [
      'Programación Multimedia y Dispositivos Móviles',
      'Desarrollo de Interfaces',
      'Digitalización Aplicada',
      'Administración y Gestión de Empresa',
      'Itinerario para la Empleabilidad',
      'Sostenibilidad Aplicada al Sistema Productivo',
      'Proyecto de Desarrollo de Aplicaciones Multiplataforma'
    ];
    subjects.forEach(subject => {
      this.subjectNameMap.set(this.cleanSubjectNameForFile(subject), subject);
    });
  }

  setSelectedSubjectName(name: string): void {
    this.selectedSubjectName = name;
  }

  getSelectedSubjectName(): string | null {
    return this.selectedSubjectName;
  }

  // Devuelve el nombre original a partir del nombre limpio/de archivo
  getDisplaySubjectName(cleanName: string): string {
    return this.subjectNameMap.get(cleanName) || this.capitalizeAndReplaceHyphens(cleanName);
  }

  // Helper para convertir el nombre de la asignatura a un formato de ruta amigable/nombre de archivo
  private cleanSubjectNameForFile(name: string): string {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  // Intento básico de convertir un nombre de archivo a un nombre display si no está en el mapa
  private capitalizeAndReplaceHyphens(name: string): string {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}