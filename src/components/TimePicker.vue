<template>
  <div class="timepicker-container">
    Working hours start at
    <div class="timepicker-input-wrapper">
      <input
        v-model="startHour"
        class="timepicker-input"
        type="text"
        pattern="\d*"
        maxlength="2"
        name="Hour"
        min="0"
        max="23"
        size="1"
      >:
      <input
        v-model="startMin"
        class="timepicker-input"
        type="text"
        pattern="\d*"
        maxlength="2"
        name="Minute"
        min="0"
        max="59"
        size="1"
      >
    </div>
    Working hours end at
    <div class="timepicker-input-wrapper">
      <input
        v-model="endHour"
        class="timepicker-input"
        type="text"
        pattern="\d*"
        maxlength="2"
        name="Hour"
        min="0"
        max="23"
        size="1"
      >:
      <input
        v-model="endMin"
        class="timepicker-input"
        type="text"
        pattern="\d*"
        maxlength="2"
        name="Minute"
        min="0"
        max="59"
        size="1"
      >
    </div>
    Remind me to take a break every
    <div class="timepicker-input-wrapper">
      <input
        v-model="shortBreak"
        class="timepicker-input"
        type="number"
        name="Minute"
        min="0"
        size="1"
        value="10"
        disabled
      > minutes
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from '@vue/composition-api';

export default defineComponent({
  name: 'TimePicker',
  setup(props, { emit }) {
    let startHour = ref('08');
    let startMin = ref('00');
    let endHour = ref('17');
    let endMin = ref('00');
    let shortBreak = ref('20');

    emit('input', [
      startHour.value,
      startMin.value,
      endHour.value,
      endMin.value,
      shortBreak.value
    ]);

    let test = watch([startHour, startMin, endHour, endMin, shortBreak], (curr, prev) => {
      emit('input', curr);
    });

    return {
      startHour,
      startMin,
      endHour,
      endMin,
      shortBreak
    };
  }
});
</script>

<style lang="scss">

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
