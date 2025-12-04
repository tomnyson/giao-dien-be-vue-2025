<script setup>
import { RouterLink } from 'vue-router'
import Menu from './components/Menu.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="bg-light min-vh-100">
    <Menu />
    <main class="container py-4">
          <router-view />
    </main>

    <Footer />
  </div>
</template>

