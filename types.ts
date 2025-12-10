export enum StageType {
  INTRO = 'INTRO',
  EVAPORATION = 'EVAPORATION',
  CONDENSATION = 'CONDENSATION',
  PRECIPITATION = 'PRECIPITATION',
  COLLECTION = 'COLLECTION',
  CERTIFICATE = 'CERTIFICATE'
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GameState {
  currentStage: StageType;
  score: number;
  studentName: string;
  history: string[]; // Track user actions for AI summary
}

export interface DraggableItem {
  id: string;
  content: string;
  category: 'cloud' | 'ground' | 'sun';
}