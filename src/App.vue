<template>
  <div>
    <router-view />
    <Footer />
  </div>
</template>

<script lang="ts">
import MainMenu from '@/layouts/MainMenu.vue';
import { defineComponent, provide } from '@vue/composition-api';
import Vue from 'vue';
import Component from 'vue-class-component';
import Auth, { IUserFlows } from './utils/Auth';
import { Configuration } from 'msal';
import Footer from '@/components/Footer.vue';


export default defineComponent({
  name: 'App',
  components: {
    MainMenu,
    Footer
  },
  setup() {
    provide('auth', Vue.prototype.$auth);
    provide('router', Vue.prototype.$routerHandle);
  }
});
</script>
