// presenters/PomodoroTimerPresenter.ts
import { TimerModel, TimerPresenter } from "../types/timer.types";

export class PomodoroTimerPresenter implements TimerPresenter {
  constructor(private model: TimerModel) {}

  startTimer(): void {
    this.model.start();
  }

  pauseTimer(): void {
    this.model.pause();
  }

  resetTimer(): void {
    this.model.reset();
  }

  getDisplayTime(): string {
    const state = this.model.getState();
    const remainingSeconds = state.duration - state.elapsedTime;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  getProgressRatio(): number {
    const state = this.model.getState();
    return state.elapsedTime / state.duration;
  }

  isRunning(): boolean {
    return this.model.getState().isRunning;
  }
}
