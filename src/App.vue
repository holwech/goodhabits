<template>
  <router-view />
</template>

<script lang="ts">
import MainMenu from '@/layouts/MainMenu.vue';
import { defineComponent, provide } from '@vue/composition-api';
import Vue from 'vue';
import Component from 'vue-class-component';
import Auth, { IUserFlows } from './utils/Auth';
import { Configuration } from 'msal';


export default defineComponent({
  name: 'App',
  components: {
    MainMenu
  },
  setup() {
    provide('auth', Vue.prototype.$auth);
    provide('router', Vue.prototype.$routerHandle);
  }
});
</script>
