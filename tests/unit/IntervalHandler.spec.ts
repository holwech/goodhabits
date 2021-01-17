import IntervalController, { IntervalSignal } from '@/utils/IntervalController';

jest.useFakeTimers();

describe('IntervalController', () => {
  it('can be created', () => {
    const controller = new IntervalController(
      1,
      2,
      1,
      1,
      () => undefined
    );
    expect(controller).toBeDefined();
  });
});

describe('IntervalController', () => {
  it('triggers events in the right order', async () => {
    let events: IntervalSignal[] = [];
    const controller = new IntervalController(
      50,
      52,
      1,
      1,
      (signal: IntervalSignal) => {
        events.push(signal);
      }
    );
    controller.setLimitTime(undefined);
    controller.start();
    jest.advanceTimersByTime(60);

    expect(events[0]).toBe(IntervalSignal.SHORT_INTERVAL_END);
    expect(events[1]).toBe(IntervalSignal.LONG_INTERVAL_END);
    expect(events[2]).toBe(IntervalSignal.BREAK_NO_ACK);
    expect(events[3]).toBe(IntervalSignal.BREAK_NO_ACK);
    expect(events[4]).toBe(IntervalSignal.BREAK_NO_ACK);
    expect(events[5]).toBe(IntervalSignal.BREAK_NO_ACK);
    expect(events[6]).toBe(IntervalSignal.BREAK_NO_ACK);
    expect(events[7]).toBe(IntervalSignal.BREAK_NO_ACK_LIMIT_REACHED);
  });

  it('should reset long time when duration is changed', async () => {
    let events: IntervalSignal[] = [];
    const controller = new IntervalController(
      100000,
      100000,
      1,
      1,
      (signal: IntervalSignal) => {
        events.push(signal);
      }
    );
    controller.setLimitTime(undefined);
    controller.longIntervalHandler.setDuration(50)
    controller.start();
    jest.advanceTimersByTime(150);

    expect(events[0]).toBe(IntervalSignal.LONG_INTERVAL_END);
    expect(events[1]).toBe(IntervalSignal.BREAK_NO_ACK);
    expect(events[2]).toBe(IntervalSignal.BREAK_NO_ACK);
    expect(events[3]).toBe(IntervalSignal.BREAK_NO_ACK);
    expect(events[4]).toBe(IntervalSignal.BREAK_NO_ACK);
    expect(events[5]).toBe(IntervalSignal.BREAK_NO_ACK);
    expect(events[6]).toBe(IntervalSignal.BREAK_NO_ACK_LIMIT_REACHED);
    expect(events[7]).toBe(IntervalSignal.LONG_INTERVAL_END);
  });

  it('should break when ack break received', async () => {
    let events: IntervalSignal[] = [];
    const controller = new IntervalController(
      50,
      51,
      1,
      1,
      (signal: IntervalSignal) => {
        events.push(signal);
      }
    );
    controller.setLimitTime(undefined);
    controller.start();
    jest.advanceTimersByTime(53);
    controller.startBreak();
    jest.advanceTimersByTime(55);

    expect(events[0]).toBe(IntervalSignal.SHORT_INTERVAL_END);
    expect(events[1]).toBe(IntervalSignal.LONG_INTERVAL_END);
    expect(events[2]).toBe(IntervalSignal.BREAK_NO_ACK);
    expect(events[3]).toBe(IntervalSignal.BREAK_NO_ACK);
    expect(events[4]).toBe(IntervalSignal.BREAK_NO_ACK);
    expect(events[5]).toBe(IntervalSignal.BREAK_START);
    expect(events[6]).toBe(IntervalSignal.BREAK_END);
    expect(events[7]).toBe(IntervalSignal.SHORT_INTERVAL_END);
    expect(events[8]).toBe(IntervalSignal.LONG_INTERVAL_END);
  });
});

// describe('HelloWorld.vue', () => {
//   it('renders props.msg when passed', () => {
//     const msg = 'new message';
//     const wrapper = shallowMount(HelloWorld, {
//       propsData: { msg }
//     });
//     expect(wrapper.text()).toMatch(msg);
//   });
// });
