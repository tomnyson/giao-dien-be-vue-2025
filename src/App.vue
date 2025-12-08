<script setup>
import { RouterLink } from 'vue-router'
import Menu from './components/Menu.vue'
import Footer from './components/Footer.vue'
import ToastNotification from './components/ToastNotification.vue'
import { onMounted, provide, reactive } from 'vue'
import { useToast } from './composables/useToast'

const user = reactive({})
const { toasts, removeToast } = useToast()

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
    <!-- Skip to main content for accessibility -->
    <a href="#main-content" class="skip-to-main">Chuyển đến nội dung chính</a>
    
    <Menu />
    <main id="main-content" class="container py-4" role="main">
      <router-view />
    </main>
    <Footer />
    
    <!-- Toast Container -->
    <div class="toast-wrapper" role="status" aria-live="polite" aria-atomic="true">
      <ToastNotification
        v-for="toast in toasts"
        :key="toast.id"
        :show="toast.show"
        :message="toast.message"
        :type="toast.type"
        :duration="0"
        @close="removeToast(toast.id)"
      />
    </div>
  </div>
</template>

<style>
.toast-wrapper {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 576px) {
  .toast-wrapper {
    right: 10px;
    left: 10px;
  }
}
</style>
