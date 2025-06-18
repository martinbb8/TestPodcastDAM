// src/app/test/test.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    HttpClientModule // Para poder usar HttpClient
  ],
  templateUrl: './test.html',
  styleUrls: ['./test.css']
})
export class TestComponent implements OnInit {
  subjectName: string | null = null;
  displaySubjectName: string | null = null; // Nombre decodificado para mostrar
  allQuestions: Question[] = []; // Todas las preguntas de la asignatura
  shuffledQuestions: Question[] = []; // Preguntas aleatorizadas para el test actual
  currentQuestionIndex: number = 0; // Índice de la pregunta actual
  currentQuestion: Question | undefined; // Objeto de la pregunta actual
  shuffledOptions: string[] = []; // Opciones de la pregunta actual, aleatorizadas
  selectedAnswer: string | null = null; // Respuesta seleccionada por el usuario
  isAnswered: boolean = false; // Si la pregunta actual ya fue respondida
  isCorrect: boolean | null = null; // Si la respuesta seleccionada fue correcta
  incorrectAnswersCount: number = 0; // Contador de respuestas incorrectas
  testFinished: boolean = false; // Indica si el test ha terminado
  finalScoreMessage: string | null = null; // Mensaje final del score

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en los parámetros de la URL
    // Esto es crucial para resetear el test si se vuelve a la misma asignatura
    this.route.paramMap.subscribe(params => {
      const encodedSubjectName = params.get('subjectName');
      if (encodedSubjectName) {
        this.subjectName = encodedSubjectName;
        this.displaySubjectName = decodeURIComponent(encodedSubjectName);
        this.resetTestState(); // <--- RESETEA TODO EL ESTADO DEL TEST AL INICIAR/REINICIAR
        this.loadQuestionsForSubject(this.displaySubjectName);
      } else {
        console.error('No se ha proporcionado el nombre de la asignatura.');
        this.router.navigate(['/home']);
      }
    });
  }

  // Resetea TODAS las variables de estado para iniciar un nuevo test
  resetTestState(): void {
    this.allQuestions = [];
    this.shuffledQuestions = [];
    this.currentQuestionIndex = 0;
    this.currentQuestion = undefined;
    this.shuffledOptions = [];
    this.selectedAnswer = null;
    this.isAnswered = false;
    this.isCorrect = null;
    this.incorrectAnswersCount = 0;
    this.testFinished = false;
    this.finalScoreMessage = null;
  }

  // Carga las preguntas desde un archivo JSON para la asignatura específica
  loadQuestionsForSubject(subject: string): void {
    let jsonFileName: string;

    switch (subject) {
      case 'Digitalización Aplicada':
        jsonFileName = 'digitalizacion-aplicada-questions.json';
        break;
      case 'Acceso a Datos':
        jsonFileName = 'acceso-datos-questions.json';
        break;
      case 'Aulanova':
        jsonFileName = 'aulanova-questions.json';
        break;
      default:
        console.warn(`No hay archivo JSON configurado para la asignatura: ${subject}`);
        this.router.navigate(['/home']); // Redirigir si no hay preguntas
        return;
    }

    this.http.get<Question[]>(`/assets/data/${jsonFileName}`).subscribe({
      next: (data) => {
        this.allQuestions = data;
        this.shuffleQuestions(); // Aleatoriza el orden de las preguntas
        this.setNextQuestion(); // Carga la primera pregunta
      },
      error: (err) => {
        console.error(`Error al cargar las preguntas para ${subject}:`, err);
        this.router.navigate(['/home']); // Redirigir a inicio en caso de error de carga
      }
    });
  }

  // Aleatoriza el array completo de preguntas
  shuffleQuestions(): void {
    this.shuffledQuestions = [...this.allQuestions].sort(() => Math.random() - 0.5);
  }

  // Prepara la pregunta actual y sus opciones aleatorias
  setNextQuestion(): void {
    if (this.currentQuestionIndex < this.shuffledQuestions.length) {
      this.currentQuestion = this.shuffledQuestions[this.currentQuestionIndex];
      this.shuffleOptions(); // Aleatoriza las opciones de la pregunta actual
      this.resetQuestionStateForNext(); // Resetear el estado de la UI para la nueva pregunta
    } else {
      // El test ha terminado
      this.testFinished = true;
      this.calculateAndDisplayFinalScore();
    }
  }

  // Aleatoriza las opciones de la pregunta actual
  shuffleOptions(): void {
    if (this.currentQuestion && this.currentQuestion.options) {
      this.shuffledOptions = [...this.currentQuestion.options].sort(() => Math.random() - 0.5);
    }
  }

  // Maneja la selección de una respuesta
  selectAnswer(selectedOption: string): void {
    if (this.isAnswered) {
      return; // No hacer nada si ya se respondió la pregunta
    }

    this.selectedAnswer = selectedOption;
    this.isAnswered = true;
    this.isCorrect = (selectedOption === this.currentQuestion?.correctAnswer);

    if (!this.isCorrect) {
      this.incorrectAnswersCount++; // Incrementar contador de fallos
    }
  }

  // Pasa a la siguiente pregunta o finaliza el test
  nextQuestion(): void {
    this.currentQuestionIndex++;
    this.setNextQuestion();
  }

  // Resetea el estado específico de la pregunta actual para la siguiente iteración
  resetQuestionStateForNext(): void {
    this.selectedAnswer = null;
    this.isAnswered = false;
    this.isCorrect = null;
  }

  // Calcula los fallos adicionales según la lógica dada
  calculateAdditionalFaults(initialFaults: number): number {
    if (initialFaults <= 2) return 0; // Hasta 2 fallos, no hay adicionales
    if (initialFaults >= 3 && initialFaults <= 5) return 1;
    if (initialFaults >= 6 && initialFaults <= 8) return 2;
    if (initialFaults >= 9 && initialFaults <= 11) return 3;
    if (initialFaults >= 12 && initialFaults <= 14) return 4;
    // Para 15 o más fallos: cada 3 fallos adicionales suma 1 fallo extra
    if (initialFaults >= 15) {
      // Suma 4 fallos iniciales (por el bloque de 12-14)
      // Y luego, por cada 3 fallos por encima de 14, suma 1 más
      return 4 + Math.floor((initialFaults - 14) / 3);
    }
    return 0; // Por si acaso
  }

  // Calcula y muestra el score final
  calculateAndDisplayFinalScore(): void {
    const additionalFaults = this.calculateAdditionalFaults(this.incorrectAnswersCount);
    const totalFaults = this.incorrectAnswersCount + additionalFaults;
    const correctCount = this.shuffledQuestions.length - totalFaults;
    const finalCorrect = Math.max(0, correctCount); // Asegura que no sea negativo

    this.finalScoreMessage = `Resultado: ${finalCorrect} / ${this.shuffledQuestions.length}`;
    // Aquí puedes integrar un MatDialog si prefieres una modal para el resultado final
    // En el HTML lo mostraremos directamente.
  }

  // Navega de vuelta a la lista de asignaturas (asumiendo que era para test)
  goToSubjects(): void {
    this.router.navigate(['/subjects', 'test']); // Volver a la lista de asignaturas de Tests
  }

  // Para iniciar el test de nuevo si se muestra el resultado final
  restartTest(): void {
    this.resetTestState(); // Reinicia todo el estado
    this.loadQuestionsForSubject(this.displaySubjectName || ''); // Vuelve a cargar las preguntas
  }
}