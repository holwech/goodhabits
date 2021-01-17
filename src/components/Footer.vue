<template>
  <b-navbar id="footer" class="justify-content-md-center">
    This site is a prototype and <a href="mailto: joachim.holwech@example.com" style="padding: 0px 3px;">feedback is appreciated</a> 
    |
    <b-button variant="link-dark" href="https://github.com/holwech/habitbird" target="_blank">Github</b-button>
    <b-button variant="link-dark" href="https://holwech.github.io" target="_blank">Blog</b-button>
    <b-button variant="link-dark" href="https://www.pandemicstatus.today/" target="_blank">Pandemic status</b-button>
  </b-navbar>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: 'Footer',
});
</script>


<style lang="scss">
#footer {
    background-color: #ff9a0d;
    border: 0px;
}

</style>