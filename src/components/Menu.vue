<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref, inject, onMounted } from 'vue'

const isOpen = ref(false)
const share = inject('share')
const router = useRouter()

const toggleNav = () => {
  isOpen.value = !isOpen.value
}


const Handlelogout = () => {
  localStorage.removeItem('ketqua');
  if (share) {
    share.username = ''
  }
  router.push('/')
}
console.log(share.user)
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/">VUEJS</RouterLink>
      
      <button
        class="navbar-toggler"
        type="button"
        aria-label="Toggle navigation"
        :aria-expanded="isOpen"
        @click="toggleNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div :class="['collapse navbar-collapse', { show: isOpen }]">
        <ul class="navbar-nav ms-auto align-items-lg-center">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Products</RouterLink>
          </li>
           <li class="nav-item ms-lg-2" v-if="share.username && share.username != ''">
              Hi: {{ share.username }}
          </li>
          <li class="nav-item ms-lg-2" v-if="share.username && share.username != ''">
            <input type="button" @click="Handlelogout" value="Log out"  class="btn btn-outline-primary btn-sm px-3" />
          </li>
          <li class="nav-item ms-lg-2" v-else>
            <RouterLink  class="btn btn-outline-primary btn-sm px-3" to="/login">Login</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
