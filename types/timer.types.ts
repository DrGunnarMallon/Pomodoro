export interface TimerState {
  duration: number;
  elapsedTime: number;
  isRunning: boolean;
  isCompleted: boolean;
}

export interface TimerModel {
  getState(): TimerState;
  start(): void;
  pause(): void;
  reset(): void;
  tick(): void;
  subscribe(callback: (state: TimerState) => void): () => void;
}

export type SessionType = 'work' | 'break';

export interface TimerPresenter {
  startTimer(): void;
  pauseTimer(): void;
  resetTimer(): void;
  getDisplayTime(): string;
  getProgressRatio(): number;
  isRunning(): boolean;
}
