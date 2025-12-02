<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="bg-white border-top mt-auto py-4">
    <div class="container">
      <div class="row g-4">
        <div class="col-md-4">
          <RouterLink to="/" class="navbar-brand fw-bold text-primary mb-2 d-inline-block">Shopping Cart</RouterLink>
          <p class="text-secondary mb-0">Curated gear, quick shipping, and support when you need it.</p>
        </div>
        <div class="col-md-4">
          <h6 class="text-uppercase text-secondary fw-semibold small mb-3">Browse</h6>
          <ul class="list-unstyled mb-0 d-grid gap-2">
            <li><RouterLink class="text-reset text-decoration-none" to="/">Home</RouterLink></li>
            <li><RouterLink class="text-reset text-decoration-none" to="/">Products</RouterLink></li>
            <li><RouterLink class="text-reset text-decoration-none" to="/login">Login</RouterLink></li>
          </ul>
        </div>
        <div class="col-md-4">
          <h6 class="text-uppercase text-secondary fw-semibold small mb-3">Stay in touch</h6>
          <div class="d-flex gap-3">
            <a class="text-primary-emphasis" href="#"><i class="bi bi-facebook fs-5"></i></a>
            <a class="text-primary-emphasis" href="#"><i class="bi bi-instagram fs-5"></i></a>
            <a class="text-primary-emphasis" href="#"><i class="bi bi-twitter fs-5"></i></a>
          </div>
          <p class="text-secondary small mb-0 mt-2">Support: support@example.com</p>
        </div>
      </div>
      <hr class="my-4" />
      <div class="d-flex flex-wrap justify-content-between text-secondary small">
        <span>© {{ new Date().getFullYear() }} Shopping Cart. All rights reserved.</span>
        <div class="d-flex gap-3">
          <a class="text-reset text-decoration-none" href="#">Privacy</a>
          <a class="text-reset text-decoration-none" href="#">Terms</a>
        </div>
      </div>
    </div>
  </footer>
</template>
