// services/TimerService.ts
import { PomodoroTimerModel } from "../models/PomodoroTimerModel";
import { PomodoroTimerPresenter } from "../presenters/PomodoroTimerPresenter";

export class TimerService {
  private static instance: TimerService;
  private model: PomodoroTimerModel;
  private presenter: PomodoroTimerPresenter;

  private constructor() {
    this.model = new PomodoroTimerModel(25 * 60);
    this.presenter = new PomodoroTimerPresenter(this.model);
  }

  static getInstance(): TimerService {
    if (!TimerService.instance) {
      TimerService.instance = new TimerService();
    }
    return TimerService.instance;
  }

  getPresenter(): PomodoroTimerPresenter {
    return this.presenter;
  }

  resetTimer(): void {
    this.presenter.resetTimer();
  }
}
