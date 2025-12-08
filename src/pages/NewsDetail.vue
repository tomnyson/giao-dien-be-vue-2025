<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const route = useRoute()
const router = useRouter()
const post = ref(null)
const isLoading = ref(false)

const fetchPost = async (slug) => {
  if (!slug) return
  try {
    isLoading.value = true
    const res = await axios.get(`${API}/news`, { params: { slug } })
    const found = res.data?.[0]
    if (!found) {
      router.replace('/404')
      return
    }
    post.value = found
  } catch (error) {
    console.error('Load news detail error', error)
    router.replace('/404')
  } finally {
    isLoading.value = false
  }
}

watch(() => route.params.slug, (slug) => {
  fetchPost(slug)
}, { immediate: true })
</script>

<template>
  <main class="container py-4">
    <div v-if="isLoading" class="text-center text-secondary py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="post">
    <div class="mb-3">
      <RouterLink to="/news" class="text-decoration-none small">
        ← Quay lại danh sách
      </RouterLink>
    </div>
    <article class="card shadow-sm">
      <img :src="post.cover" class="card-img-top" :alt="post.title" />
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="badge text-bg-primary">{{ post.category }}</span>
          <small class="text-muted">{{ new Date(post.date).toLocaleDateString() }}</small>
        </div>
        <h1 class="h4 mb-3">{{ post.title }}</h1>
        <p class="text-muted small">Tác giả: {{ post.author }}</p>
        <div class="content" v-html="post.content"></div>
      </div>
    </article>
    </div>
  </main>
</template>

<style scoped>
.card-img-top {
  height: 320px;
  object-fit: cover;
}

.content :global(p) {
  margin-bottom: 0.75rem;
}

.content :global(ul),
.content :global(ol) {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}
</style>
