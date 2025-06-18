// src/app/dialog-options/dialog-options.component.ts
import { Component, Inject } from '@angular/core'; // Importa Inject
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button'; // Para botones dentro del diálogo
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // Para controlar el diálogo y recibir datos

export interface DialogData {
  title: string;
  message: string;
  options: string[];
}

@Component({
  selector: 'app-dialog-options',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule // Necesario para los botones dentro del diálogo
  ],
  templateUrl: './dialog-options.html',
  styleUrls: ['./dialog-options.css']
})
export class DialogOptionsComponent {
  // MatDialogRef es una referencia al diálogo abierto, nos permite cerrarlo
  // MAT_DIALOG_DATA se usa para inyectar datos pasados al diálogo desde el componente que lo abre
  constructor(
    public dialogRef: MatDialogRef<DialogOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  // Función para cerrar el diálogo sin pasar ningún resultado
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Función para cerrar el diálogo pasando la opción seleccionada
  selectOption(option: string): void {
    this.dialogRef.close(option); // Cerramos el diálogo y pasamos la opción seleccionada
  }
}