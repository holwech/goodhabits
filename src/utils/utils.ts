import { Ref } from "@vue/composition-api"

export const countdownInterval = (count: Ref<number>, interval: number=1000) => {
  let id = setInterval(() => {
    count.value -= 1000;
    if (count.value == 0) {
      clearInterval(id);
    }
  }, interval);
  return id;
}