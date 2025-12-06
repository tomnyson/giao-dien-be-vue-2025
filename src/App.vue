<script setup>
import { RouterLink } from 'vue-router'
import Menu from './components/Menu.vue';
import Footer from './components/Footer.vue';
import { onMounted, provide, reactive } from 'vue'
const user = reactive({})
provide('share', user)

onMounted(() => {
  const currentUser = localStorage.getItem('ketqua')
  if (!currentUser) return

  const currentUserObj = JSON.parse(currentUser)
  Object.assign(user, currentUserObj) 
})

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
