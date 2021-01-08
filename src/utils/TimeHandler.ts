export interface WorkHours {
  startHour: number,
  startMin: number,
  endHour: number,
  endMin: number
}

export class TimeHandler {
  private id?: number;
  private workHours?: WorkHours = undefined;
  private timeoutStartTime = 0;
  private timeCounterCallback?: (remainingTime: number) => void;
  private timeCounterIntervalId?: number;

  constructor(
    private duration: number,
    private callback?: Function,
    private autoRestart: boolean = true,
  ) { }

  public start() {
    this.timeoutStartTime = Date.now();
    this.id = setTimeout(this.timeout.bind(this), this.duration);
    if (this.timeCounterCallback) {
      this.timeCounterIntervalId = setInterval(
        () => { this.timeCounterCallback!(this.duration - (Date.now() - this.timeoutStartTime)); },
        1000
      );
    }
  }

  public stop() {
    if (this.id) {
      clearTimeout(this.id);
      this.id = undefined;
    }
    if (this.timeCounterIntervalId) {
      clearInterval(this.timeCounterIntervalId);
      this.timeCounterIntervalId = undefined;
    }
  }

  public restart() {
    this.stop();
    this.start();
  }

  public setWorkHours(
    workHours?: WorkHours,
  ) {
    this.workHours = workHours;
  }

  public setDuration(duration: number) {
    const prevDuration = this.duration;
    this.duration = duration;
    const remainingTime = prevDuration - (Date.now() - this.timeoutStartTime);
    if (this.id && remainingTime > this.duration) {
      this.restart();
    }   
  }

  public attachTimeCounter(callback: (remainingTime: number) => void) {
    this.timeCounterCallback = callback;
    if (this.id) {
      this.timeCounterIntervalId = setInterval(
        () => { this.timeCounterCallback!(this.duration - (Date.now() - this.timeoutStartTime)); },
        1000
      );
    }
  }

  public isRunning() {
    return this.id !== undefined;
  }

  private checkLimits() {
    if (this.workHours === undefined) {
      return true;
    }
    const now = new Date();
    const startLimit = new Date(now.getFullYear(), now.getMonth(), now.getDate(), this.workHours.startHour, this.workHours.startMin);
    const endLimit = new Date(now.getFullYear(), now.getMonth(), now.getDate(), this.workHours.endHour, this.workHours.endMin);
    if (now >= startLimit && now < endLimit) {
      return true;
    }
    return false;
  }

  private timeout() {
    this.stop()
    if (this.checkLimits() && this.callback) {
      this.callback();
    }
    if (this.autoRestart) {
      this.start();
    }
  }
}