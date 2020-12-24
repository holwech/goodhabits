export default class Timer {
  private intervals: number[] = [];
  private timeouts: number[] = [];
  constructor(
    private startLimitHours: number = 8,
    private startLimitMin: number = 0,
    private endLimitHours: number = 17,
    private endLimitMin: number = 0
  ) {
    
  }

  public setLimitTime(
    startLimitHours: number,
    startLimitMin: number,
    endLimitHours: number,
    endLimitMin: number
  ) {
    this.startLimitHours = startLimitHours;
    this.startLimitMin = startLimitMin;
    this.endLimitHours = endLimitHours;
    this.endLimitMin = endLimitMin;
  }

  public startInterval(interval: number, callback: Function) {
    const intervalId = setInterval(() => this.checkLimits(callback), interval);
    this.intervals.push();
    return intervalId;
  }

  public stopInterval(intervalId: number) {
    window.clearInterval(intervalId);
  }

  public stopAllIntervals() {
    this.intervals.forEach(id => {
      window.clearInterval(id);
    });
  }

  public startTimeout(time: number, callback: Function) {
    const timeoutsId = setTimeout(() => this.checkLimits(callback), time);
    this.timeouts.push();
    return timeoutsId;
  }

  public stopTimeout(timeoutId: number) {
    window.clearTimeout(timeoutId);
  }

  public stopAllTimeouts() {
    this.timeouts.forEach(id => {
      window.clearTimeout(id);
    });
  }

  private checkLimits(callback: Function) {
    // Don't know why typescript assumes this as string type
    const now = new Date();
    const startLimit = new Date(now.getFullYear(), now.getMonth(), now.getDate(), this.startLimitHours, this.startLimitMin);
    const endLimit = new Date(now.getFullYear(), now.getMonth(), now.getDate(), this.endLimitHours, this.endLimitMin);
    if (now >= startLimit && now < endLimit) {
      callback();
    }
  }
}