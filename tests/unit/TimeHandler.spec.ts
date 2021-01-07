import { TimeHandler } from '@/utils/TimeHandler';
import MockDate from 'mockdate';

jest.useFakeTimers();

describe('IntervalController', () => {
  it('can be created', () => {
    const timeHandler = new TimeHandler(
      1,
      () => console.log('triggered'),
      false
    );
    expect(timeHandler).toBeDefined();
  });

  it('can call callback on timeout', () => {
    let flag = false;
    const timeHandler = new TimeHandler(
      1,
      () => flag = true,
      false
    );
    timeHandler.setWorkHours(undefined);
    timeHandler.start();

    jest.runAllTimers();

    expect(flag).toBe(true);
  });

  it('should change timeout if duration is set', () => {
    let flag = false;
    const timeHandler = new TimeHandler(
      100,
      () => flag = true,
      false
    );
    timeHandler.start();
    timeHandler.setDuration(10);
    jest.advanceTimersByTime(11);

    expect(flag).toBe(true);
  });

  it('should not change timeout if duration is longer than remaining time', () => {
    let flag = false;
    const timeHandler = new TimeHandler(
      10,
      () => flag = true,
      false
    );
    timeHandler.start();
    timeHandler.setDuration(100);
    jest.advanceTimersByTime(11);

    expect(flag).toBe(true);
  });

  it('should count time if timer counter is attached', () => {
    let count = 0;
    const timeHandler = new TimeHandler(
      10000,
      () => undefined,
      false
    );
    timeHandler.start();
    timeHandler.attachTimeCounter((remainingTime) => count++);
    jest.advanceTimersByTime(5000);

    expect(count).toBe(5);
  });

  it('can call callback multiple times on auto restart', () => {
    let count = 0;
    const timeHandler = new TimeHandler(
      1,
      () => count++,
      true
    );
    timeHandler.setWorkHours(undefined);
    timeHandler.start();

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(count).toBe(2);
  });

  it('should not trigger outside work hours', () => {
    let count = 0;
    const timeHandler = new TimeHandler(
      1,
      () => count++,
      true
    );
    timeHandler.setWorkHours({startHour: 8, startMin: 0, endHour: 17,  endMin: 0});
    timeHandler.start();
    MockDate.set('2020-01-01 07:59:00');
    jest.runOnlyPendingTimers();
    MockDate.set('2020-01-01 17:01:00');
    jest.runOnlyPendingTimers();

    expect(count).toBe(0);
  });

  it('should set work hours when limit is set', () => {
    let count = 0;
    const timeHandler = new TimeHandler(
      1,
      () => count++,
      true
    );
    timeHandler.setWorkHours({startHour: 9, startMin: 45, endHour: 10,  endMin: 15});
    timeHandler.start();
    MockDate.set('2020-01-01 09:44:00');
    jest.runOnlyPendingTimers();
    MockDate.set('2020-01-01 09:46:00');
    jest.runOnlyPendingTimers();
    MockDate.set('2020-01-01 10:14:00');
    jest.runOnlyPendingTimers();
    MockDate.set('2020-01-01 10:16:00');
    jest.runOnlyPendingTimers();

    expect(count).toBe(2);
  });
});