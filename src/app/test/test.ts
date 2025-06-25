// src/app/test/test.ts
import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'; // ¡IMPORTANTE! Importar MatIconModule

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
    HttpClientModule,
    MatIconModule // ¡AÑADIDO AQUÍ!
  ],
  templateUrl: './test.html',
  styleUrls: ['./test.css']
})
export class TestComponent implements OnInit {
  subjectName: string | null = null;
  displaySubjectName: string | null = null;
  allQuestions: Question[] = [];
  shuffledQuestions: Question[] = [];
  currentQuestionIndex: number = 0;
  currentQuestion: Question | undefined;
  shuffledOptions: string[] = [];
  selectedAnswer: string | null = null;
  isAnswered: boolean = false;
  isCorrect: boolean | null = null;
  incorrectAnswersCount: number = 0;
  testFinished: boolean = false;
  finalScoreMessage: string | null = null;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<TestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { subjectName: string }
  ) {
    this.subjectName = data.subjectName;
    this.displaySubjectName = decodeURIComponent(data.subjectName);
  }

  ngOnInit(): void {
    if (this.subjectName) {
      this.resetTestState();
      this.loadQuestionsForSubject(this.displaySubjectName || '');
    } else {
      console.error('No se ha proporcionado el nombre de la asignatura al modal de test.');
      this.dialogRef.close();
    }
  }

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
        this.dialogRef.close();
        return;
    }

    this.http.get<Question[]>(`/assets/data/${jsonFileName}`).subscribe({
      next: (data) => {
        this.allQuestions = data;
        this.shuffleQuestions();
        this.setNextQuestion();
      },
      error: (err) => {
        console.error(`Error al cargar las preguntas para ${subject}:`, err);
        this.dialogRef.close();
      }
    });
  }

  shuffleQuestions(): void {
    this.shuffledQuestions = [...this.allQuestions].sort(() => Math.random() - 0.5);
  }

  setNextQuestion(): void {
    if (this.currentQuestionIndex < this.shuffledQuestions.length) {
      this.currentQuestion = this.shuffledQuestions[this.currentQuestionIndex];
      this.shuffleOptions();
      this.resetQuestionStateForNext();
    } else {
      this.testFinished = true;
      this.calculateAndDisplayFinalScore();
    }
  }

  shuffleOptions(): void {
    if (this.currentQuestion && this.currentQuestion.options) {
      this.shuffledOptions = [...this.currentQuestion.options].sort(() => Math.random() - 0.5);
    }
  }

  selectAnswer(selectedOption: string): void {
    if (this.isAnswered) {
      return;
    }

    this.selectedAnswer = selectedOption;
    this.isAnswered = true;
    this.isCorrect = (selectedOption === this.currentQuestion?.correctAnswer);

    if (!this.isCorrect) {
      this.incorrectAnswersCount++;
    }
  }

  nextQuestion(): void {
    this.currentQuestionIndex++;
    this.setNextQuestion();
  }

  resetQuestionStateForNext(): void {
    this.selectedAnswer = null;
    this.isAnswered = false;
    this.isCorrect = null;
  }

  calculateAdditionalFaults(initialFaults: number): number {
    if (initialFaults <= 2) return 0;
    if (initialFaults >= 3 && initialFaults <= 5) return 1;
    if (initialFaults >= 6 && initialFaults <= 8) return 2;
    if (initialFaults >= 9 && initialFaults <= 11) return 3;
    if (initialFaults >= 12 && initialFaults <= 14) return 4;
    if (initialFaults >= 15) {
      return 4 + Math.floor((initialFaults - 14) / 3);
    }
    return 0;
  }

  calculateAndDisplayFinalScore(): void {
    const totalQuestions = this.shuffledQuestions.length;
    let correctCount = totalQuestions - this.incorrectAnswersCount;

    const additionalFaults = this.calculateAdditionalFaults(this.incorrectAnswersCount);
    const finalFaults = this.incorrectAnswersCount + additionalFaults;
    
    const finalCorrectScore = Math.max(0, totalQuestions - finalFaults);

    this.finalScoreMessage = `Resultado: ${finalCorrectScore} / ${totalQuestions}`;
  }

  closeTestModal(): void {
    this.dialogRef.close();
  }

  restartTest(): void {
    this.resetTestState();
    this.loadQuestionsForSubject(this.displaySubjectName || '');
  }
}
