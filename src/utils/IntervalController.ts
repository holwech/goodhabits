import { TimeHandler, WorkHours } from './TimeHandler';

export enum IntervalSignal {
  SHORT_INTERVAL_END,
  LONG_INTERVAL_END,
  BREAK_NO_ACK,
  BREAK_NO_ACK_LIMIT_REACHED,
  BREAK_START,
  BREAK_END,
}

export default class IntervalController {
  public shortIntervalHandler: TimeHandler;
  public longIntervalHandler: TimeHandler;
  public breakTimer: TimeHandler;
  public breakAckTimer: TimeHandler;
  private ackBreak: boolean = false;
  private breakCount = 0;

  constructor(
    shortIntervalDuration: number,
    longIntervalDuration: number,
    longBreakDuration: number,
    breakReminderDuration: number,
    private callback: (signal: IntervalSignal) => void,
    workHours: WorkHours = {startHour: 8, startMin: 0, endHour: 17,  endMin: 0},
  ) {
    this.shortIntervalHandler = new TimeHandler(
      shortIntervalDuration,
      this.shortIntervalTimeout.bind(this),
    );
    this.longIntervalHandler = new TimeHandler(
      longIntervalDuration,
      this.longIntervalTimeout.bind(this),
      false
    );
    this.shortIntervalHandler.setWorkHours(workHours);
    this.longIntervalHandler.setWorkHours(workHours);

    this.breakTimer = new TimeHandler(
      longBreakDuration,
      this.breakTimeout.bind(this),
      false,
    );
    this.breakAckTimer = new TimeHandler(
      breakReminderDuration,
      this.breakHandler.bind(this),
      false,
    );
  }

  public start() {
    this.shortIntervalHandler.start();
    this.longIntervalHandler.start();
  }

  public restart() {
    this.shortIntervalHandler.stop();
    this.longIntervalHandler.stop();
    this.breakTimer.stop();
    this.breakAckTimer.stop();
    this.breakCount = 0;
    this.ackBreak = false;
    this.start();
  }

  public setLimitTime(
    workHours?: WorkHours,
  ) {
    this.shortIntervalHandler.setWorkHours(workHours);
    this.longIntervalHandler.setWorkHours(workHours);
  }

  public startBreak() {
    this.ackBreak = true;
  }

  private longIntervalTimeout() {
    this.shortIntervalHandler.stop();
    this.callback(IntervalSignal.LONG_INTERVAL_END);
    this.breakHandler();
  }

  private shortIntervalTimeout() {
    this.callback(IntervalSignal.SHORT_INTERVAL_END);
  }

  private breakTimeout() {
    this.start();
    this.callback(IntervalSignal.BREAK_END);
  }

  private breakHandler() {
    if (this.breakCount >= 5) {
      this.restart();
      this.callback(IntervalSignal.BREAK_NO_ACK_LIMIT_REACHED);
      return;
    }
    if (this.ackBreak) {
      this.breakTimer.start();
      this.ackBreak = false;
      this.callback(IntervalSignal.BREAK_START);
      return;
    }
    this.breakCount++;
    this.breakAckTimer.start();
    this.callback(IntervalSignal.BREAK_NO_ACK);
  }
}
