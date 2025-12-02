<script setup>
import { RouterLink } from 'vue-router'
import Menu from './components/Menu.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="bg-light min-vh-100">
    <Menu />
    <main class="container py-4">
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <router-view />
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
:global(body) {
  background-color: #f8f9fa;
}
</style>
