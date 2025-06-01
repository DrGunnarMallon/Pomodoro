// models/PomodoroTimerModel.ts
import { TimerModel, TimerState } from "../types/timer.types";

export class PomodoroTimerModel implements TimerModel {
  private state: TimerState;
  private subscribers: ((state: TimerState) => void)[] = [];
  private intervalId: number | null = null;

  constructor(duration: number = 25 * 60) {
    this.state = {
      duration,
      elapsedTime: 0,
      isRunning: false,
      isCompleted: false,
    };
  }

  getState(): TimerState {
    return { ...this.state };
  }

  start(): void {
    if (this.state.isCompleted) {
      this.reset();
    }

    this.state.isRunning = true;
    this.notifySubscribers();

    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  pause(): void {
    this.state.isRunning = false;
    this.notifySubscribers();

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(): void {
    this.pause();
    this.state.elapsedTime = 0;
    this.state.isCompleted = false;
    this.notifySubscribers();
  }

  tick(): void {
    if (!this.state.isRunning) return;

    this.state.elapsedTime += 1;

    if (this.state.elapsedTime >= this.state.duration) {
      this.state.isCompleted = true;
      this.pause();
    }

    this.notifySubscribers();
  }

  subscribe(callback: (state: TimerState) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback(this.getState()));
  }
}
