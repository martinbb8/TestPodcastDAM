// src/app/subjects/subjects.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './subjects.html',
  styleUrls: ['./subjects.css']
})
export class SubjectsComponent implements OnInit {
  mode: 'test' | 'podcast' | 'unknown' = 'unknown';

  // Lista actualizada y completa de asignaturas
  subjects: string[] = [
    'Digitalización Aplicada', // La que mencionaste específicamente para empezar
    'Acceso a Datos',         // La asignatura que faltaba 
    'Programación multimedia y dispositivos móviles',
    'Desarrollo de interfaces',
    'Sistemas de gestión empresarial',
    'Itinerario para la empleabilidad II',
    'Proyecto de desarrollo de aplicaciones multiplataforma',
    'Sostenibilidad aplicada al sistema productivo',
    'Aulanova' // Tu nueva asignatura personalizada
  ];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.mode = params.get('type') as 'test' | 'podcast' || 'unknown';
      console.log('Modo de SubjectsComponent:', this.mode);
    });
  }

  goToSubject(subject: string): void {
    const encodedSubject = encodeURIComponent(subject);
    if (this.mode === 'test') {
      this.router.navigate(['/test', encodedSubject]); // Navegará a /test/Digitalización%20Aplicada
    } else if (this.mode === 'podcast') {
      this.router.navigate(['/podcast', encodedSubject]); // Navegará a /podcast/Digitalización%20Aplicada
    }
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}
