<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
   <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Shopping cart</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item active">
        <RouterLink class="nav-link" to="/">Home </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" to="/">Product</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" to="/login">Login</RouterLink>
      </li>
    </ul>
  </div>
</nav>
</template>