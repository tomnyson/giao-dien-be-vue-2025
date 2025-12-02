<script setup>
import { RouterLink } from 'vue-router'
import Menu from './components/Menu.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="bg-light min-vh-100">
    <Menu />

    <header class="bg-white border-bottom shadow-sm">
      <div class="container py-5">
        <div class="row align-items-center g-4">
          <div class="col-lg-7">
            <p class="text-uppercase text-primary fw-semibold mb-2 small">Curated tech, delivered fast</p>
            <h1 class="display-5 fw-bold mb-3">Upgrade your setup with polished picks.</h1>
            <p class="text-secondary fs-5 mb-4">
              Discover speakers, accessories, and essentials that look sharp and sound even better.
              We hand-pick every product so you can browse with confidence.
            </p>
            <div class="d-flex flex-wrap gap-2">
              <RouterLink class="btn btn-primary btn-lg" to="/">Browse products</RouterLink>
              <RouterLink class="btn btn-outline-secondary btn-lg" to="/login">Sign in</RouterLink>
            </div>
            <div class="d-flex flex-wrap gap-3 mt-3 text-secondary">
              <span class="d-flex align-items-center gap-2"><i class="bi bi-truck"></i> Free shipping over $50</span>
              <span class="d-flex align-items-center gap-2"><i class="bi bi-shield-check"></i> Secure checkout</span>
              <span class="d-flex align-items-center gap-2"><i class="bi bi-clock-history"></i> 24/7 support</span>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="card border-0 shadow-lg h-100">
              <div class="card-body">
                <p class="text-primary text-uppercase fw-semibold small mb-1">Spotlight</p>
                <h4 class="card-title fw-bold">Wireless Audio Kit</h4>
                <p class="text-secondary mb-3">Low-latency Bluetooth 5.3 • 18h battery • Studio-grade drivers</p>
                <div class="d-flex flex-wrap gap-2 mb-3">
                  <span class="badge bg-primary-subtle text-primary">New arrival</span>
                  <span class="badge bg-secondary-subtle text-secondary">Under $150</span>
                </div>
                <RouterLink to="/" class="btn btn-outline-primary w-100">
                  See collection <i class="bi bi-arrow-right"></i>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

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
