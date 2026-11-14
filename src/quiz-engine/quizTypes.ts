export type QuestionType =
  | 'multiple-choice'
  | 'typing'
  | 'map-tap'
  | 'flag'
  | 'distance'
  | 'facts'
  | 'visual';

export interface VisualClue {
  type: 'flag' | 'road-shield' | 'plate' | 'tel' | 'script';
  value: string;
  subValue?: string;
  label?: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[]; // For multiple-choice & flag questions
  correctAnswer: string;
  acceptableAnswers?: string[]; // Normalized aliases for typing questions
  hint?: string;
  countryCode?: string;
  flagEmoji?: string;
  visualClue?: VisualClue;
  explanation?: string;
  // For distance / triangulation questions
  coordinates?: [number, number]; // [lat, lng]
  targetLocationName?: string;
  targetSubdivisionName?: string;
}

export interface QuizMetadata {
  id: string;
  title: string;
  description: string;
  category:
    | 'Geography'
    | 'Capitals'
    | 'Provinces'
    | 'Subdivisions'
    | 'Area Codes'
    | 'Flags'
    | 'Cities'
    | 'Distances'
    | 'Languages'
    | 'Visual Clues'
    | 'Custom';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
  timeLimitSec?: number; // 0 for unlimited / learning mode
  countryCode?: string;
  continent?: string;
  iconName?: string;
}

export interface QuizDefinition extends QuizMetadata {
  questions: QuizQuestion[];
}

export interface QuizSessionState {
  currentQuestionIndex: number;
  score: number;
  streak: number;
  userAnswers: Array<{
    questionId: string;
    questionPrompt: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpentSec: number;
  }>;
  isFinished: boolean;
  timeRemainingSec: number;
}
