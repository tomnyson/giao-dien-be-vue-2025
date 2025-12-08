<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success', // success, error, warning, info
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['close'])

const isVisible = ref(props.show)
let timeoutId = null

const getIcon = () => {
  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill'
  }
  return icons[props.type] || icons.info
}

const getClasses = () => {
  const classes = {
    success: 'toast-success',
    error: 'toast-error',
    warning: 'toast-warning',
    info: 'toast-info'
  }
  return classes[props.type] || classes.info
}

const close = () => {
  isVisible.value = false
  if (timeoutId) clearTimeout(timeoutId)
  setTimeout(() => {
    emit('close')
  }, 300)
}

watch(() => props.show, (newVal) => {
  isVisible.value = newVal
  if (newVal && props.duration > 0) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(close, props.duration)
  }
})
</script>

<template>
  <Transition name="toast">
    <div v-if="isVisible" class="toast-container" :class="getClasses()">
      <div class="toast-content">
        <i class="bi" :class="getIcon()"></i>
        <span class="toast-message">{{ message }}</span>
        <button class="toast-close" @click="close" aria-label="Close">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  animation: slideIn 0.3s ease-out;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  color: white;
}

.toast-content i {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.toast-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.toast-success {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
}

.toast-error {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

.toast-warning {
  background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
}

.toast-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Mobile responsive */
@media (max-width: 576px) {
  .toast-container {
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
}
</style>
