<template>
  <div
    id="main-wrapper"
    class="wave-top"
  >
    <Toolbar>
      <b-button @click="notify.requestPermission()">
        Request
      </b-button>
      <b-button @click="notify.notify_delay('hello', 3)">
        Notify
      </b-button>
      <LoginButton />
    </Toolbar>
    <b-container id="main-container">
      <b-row>
        <b-col
          align-self="center"
          class="splash-text"
        >
          <h1 class="text-center">
            Good Habits
          </h1>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col
          cols="4"
        >
          <TimePicker @input="updateLimits" />
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col
          cols="4"
        >
          Seconds to long break: {{longTimerCountdown / 1000}} <br />
          Seconds to short break: {{shortTimerCountdown / 1000}}
        </b-col>
      </b-row>
    </b-container>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
    ><path
      fill="#007bff"
      fill-opacity="1"
      d="M0,224L60,234.7C120,245,240,267,360,256C480,245,600,203,720,208C840,213,960,267,1080,288C1200,309,1320,299,1380,293.3L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
    /></svg>
  </div>
</template>

<script lang="ts">
import LoginButton from '@/components/LoginButton.vue';
import Toolbar from '@/layouts/Toolbar.vue';
import { defineComponent, Ref, ref, watch } from '@vue/composition-api';
import Notify from '@/utils/Notify';
import TimePicker from '@/components/TimePicker.vue';
import Timer from '@/utils/Timer';
import { chickResponses } from '@/models/Resource';
import { countdownInterval } from '@/utils/utils';

export default defineComponent({
  name: 'MainMenu',
  components: {
    LoginButton,
    Toolbar,
    TimePicker
  },
  setup() {
    let icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEKElEQVRYhbWUXUxTZxzGD4xMMgk3cmG2cMHkwmyLIcuMbJrYmCxLoS/sw+nM4i52YWTROHcxWRYXYnazG0dINq3uQp0wQ2fAFHFmQBEubOkpWBaMWuF8FE7f0563gEU+0o9nF3BKC4W2UN7kSZqTc/6/3/uct4fjNrDAk91wkUqAywO4PDhM74MnuzcyK3u4zVAAnrSAJxHwpBs86QFPInCa/oLNULB1YHD5GDAdXQKGwROsSBg86YGLHEEDl59buLv6HfAmPgU0dZzEiQHydm7gg8QIFwllDF9OCK7qjzYHH6j+ADyZ2wBczyz4qn0bg9uNxeCJtAm4HgE2Q1H2Aq7qn3MA1/NTdnDBUAieBPUBUYcJs31VGQNn+6oQdZgSr/kx8vmrmQvwNdX6wxGHCRcMpagrL4HbfCAJFO07hGjfoaRrbvMB1JWX4IKhFJFECWfNh1nUT+L1v3xgxMnyEpwo24GO+gqAJ4g5qjB3rRQzjUWYaSzC3LVSxByLDVnrK3CibAdOlpfg5QNjglzN+SwaMN1M2tXl/bCeq8Bc/yJkoW1PHK5noW0PwBPM9VfBeq4C7sv7V76aPzIXcJpurfeO55t3rRKYb96V7my0ZNOAZb1h4fuVmGkqXhZoKkb4fmUaAZMlPRjIM7ferY86a/9Ld9JjdiOitoOI2g4iZjem2z2iztphc2vnqTXhEmNvXbF0fHO11Yqw8+Nc/f+XW3N+gqsWa8x86593U+5coMx9xdIZsrTfyDlcj6X9BsytHXdkyo4mCXi92hsSZWjveQhb58UtE+jp/BXm1ruxZ7JPFvwzO+MCo0rgPYkyDD0R4O76ccsEhrrO409rNyTKICpTy69C9ml7JcogUQY//8OWCYz2nkGX/REkyiD7tL3LB1BV39QF2PPb8Qfmh88iOngsZwLj/XUYGRuHRBkonSqLC9hstgKJsplFMwWRoeMIepoh0QAmn13fFHR++FtMP72E8KOvMTn4PZY2GgLwStJBlFV2T29BViaQ+DuxhZjrMNhzCxbcpxJANZh++jtifG0SPOb6DBPjI0uzNHgVcXGmyjpXfwfUya906MoktqCNtscH+oV/seA+DTZ6GxJlePGkKUkg6GlJOW9M0Y6vEvAA22TK5FQPyMoEIoPHEHr8S8qBeryKF5HBL5eq/w4SDaS4Lyh6PJ5tKb+GciD4xVrDA2P3IPuUdQUkyqCN3llR/Yr42JGUcH2JVLuZDrJ+NKhi7xpw7fq6cI7jOAEoFH1a7+YkUqZbEITCtAIcx3GU0u0i1dpyBRd97G9FUV7LCK6vhoaGfEFhZyXKQhsGU/ZCotppAHlZwROXHAi8LlHWKFI2nQV4SqSBi4LfvzM9IcNFKd0u+dlhyaddkimzi1RTZTUYllUWlqhGZcoeymrwN686+Wk2df8PyVq091GZYo0AAAAASUVORK5CYII=";
    let notify = new Notify(icon);
    let timer = new Timer();
    let longTimerCountdown = ref(0);
    let shortTimerCountdown = ref(0);
    let longTimerCountdownId = 0;
    let shortTimerCountdownId = 0;

    let updateLimits = (limits: Ref<string>[]) => {
      console.log(limits);
      let [startHour, startMin, endHour, endMin, longBreak, shortBreak] = limits.map((val) => parseInt(val.value));
      timer.setLimitTime(startHour, startMin, endHour, endMin);
      let shortBreakTime = shortBreak * 1000;
      let longBreakTime = longBreak * 1000;
      timer.stopAllIntervals();
      timer.startInterval(shortBreakTime, () => {
        clearInterval(shortTimerCountdownId);
        shortTimerCountdown.value = shortBreakTime;
        shortTimerCountdownId = countdownInterval(shortTimerCountdown);
        notify.notify("Time for a short break", "Take a few seconds look away from the screen and shake your legs", 5000)
      });
      timer.startInterval(longBreakTime, () => {
        clearInterval(longTimerCountdownId);
        longTimerCountdown.value = longBreakTime;
        longTimerCountdownId = countdownInterval(longTimerCountdown);
        notify.notify("Time for a long break", chickResponses[Math.floor(Math.random() * chickResponses.length)], 10000)
      });
      clearInterval(shortTimerCountdownId);
      clearInterval(longTimerCountdownId);
      shortTimerCountdown.value = shortBreakTime;
      shortTimerCountdownId = countdownInterval(shortTimerCountdown);
      longTimerCountdown.value = longBreakTime;
      longTimerCountdownId = countdownInterval(longTimerCountdown);
    }

    return {
      notify,
      updateLimits,
      timer,
      shortTimerCountdown,
      longTimerCountdown
    };
  }
});
</script>

<style lang="scss">
.board-button {
  margin-left: 5px;
}
</style>