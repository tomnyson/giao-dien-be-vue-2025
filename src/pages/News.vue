<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const posts = ref([])
const isLoading = ref(false)
const filters = reactive({
  search: '',
  category: 'Tất cả'
})

const categories = computed(() => {
  const set = new Set(posts.value.map(p => p.category))
  return ['Tất cả', ...set]
})

const filteredPosts = computed(() => {
  const search = filters.search.trim().toLowerCase()
  return posts.value.filter(post => {
    const matchCategory = filters.category === 'Tất cả' || post.category === filters.category
    const matchSearch =
      !search ||
      post.title.toLowerCase().includes(search) ||
      post.excerpt.toLowerCase().includes(search)
    return matchCategory && matchSearch
  })
})

const loadNews = async () => {
  try {
    isLoading.value = true
    const res = await axios.get(`${API}/news?_sort=date&_order=desc`)
    posts.value = res.data || []
  } catch (error) {
    console.error('Load news error', error)
    posts.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(loadNews)
</script>

<template>
  <main class="container py-4">
    <div class="row g-4">
      <aside class="col-lg-3">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">Danh mục</h5>
            <div class="list-group">
              <button
                v-for="cat in categories"
                :key="cat"
                class="list-group-item list-group-item-action"
                :class="{ active: filters.category === cat }"
                @click="filters.category = cat"
              >
                {{ cat }}
              </button>
            </div>
            <div class="mt-3">
              <label class="form-label small">Tìm bài viết</label>
              <input
                v-model="filters.search"
                type="search"
                class="form-control"
                placeholder="Từ khóa..."
              />
            </div>
          </div>
        </div>
      </aside>

      <section class="col-lg-9">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h5 mb-0">Tin tức</h2>
          <span class="text-muted small">{{ filteredPosts.length }} bài</span>
        </div>

        <div v-if="isLoading" class="text-center text-secondary py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-if="filteredPosts.length" class="row g-4">
          <div v-for="post in filteredPosts" :key="post.id" class="col-md-6">
            <div class="card h-100 shadow-sm">
              <img :src="post.cover" class="card-img-top" :alt="post.title" />
              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="badge text-bg-primary">{{ post.category }}</span>
                  <small class="text-muted">{{ new Date(post.date).toLocaleDateString() }}</small>
                </div>
                <h5 class="card-title">{{ post.title }}</h5>
                <p class="card-text text-muted small flex-grow-1">{{ post.excerpt }}</p>
                <RouterLink :to="`/news/${post.slug}`" class="btn btn-outline-primary btn-sm">
                  Đọc tiếp
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-secondary text-center py-5">
          <i class="bi bi-newspaper display-6 d-block mb-2"></i>
          Không tìm thấy bài viết.
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.card-img-top {
  height: 180px;
  object-fit: cover;
}
</style>
