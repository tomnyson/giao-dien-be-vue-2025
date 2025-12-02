<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios';
import { RouterLink } from 'vue-router';

const API = import.meta.env.VITE_API_URL

const products = ref([])
const filters = reactive({
  search: '',
  category: 'all',
  priceCap: 0,
})

const categories = computed(() => {
  const set = new Set(products.value.map(p => p.category))
  return ['all', ...set]
})

const maxPrice = computed(() => {
  if (!products.value.length) return 0
  return Math.max(...products.value.map(p => p.price))
})

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch =
      filters.search.trim() === '' ||
      product.name.toLowerCase().includes(filters.search.trim().toLowerCase()) ||
      product.description.toLowerCase().includes(filters.search.trim().toLowerCase())

    const matchesCategory = filters.category === 'all' || product.category === filters.category
    const matchesPrice = !filters.priceCap || product.price <= filters.priceCap

    return matchesSearch && matchesCategory && matchesPrice
  })
})

const formatPrice = (price) => `$${Number(price).toFixed(2)}`

onMounted(async () => {
  await loadProduct()
})

const loadProduct = async () => {
  try {
    const response = await axios.get(`${API}/products`)
    if (response.status === 200) {
      products.value = response.data
      filters.priceCap = Math.ceil(maxPrice.value)
    }
  } catch (error) {
    console.error('Failed to load products', error)
  }
}
</script>

<template>
  <main class="container mb-5" id="all-products">
    <div class="row">
      <aside class="col-lg-3 mb-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h5 class="card-title mb-0">Filters</h5>
              <button
                class="btn btn-link text-decoration-none p-0"
                @click="filters.search = ''; filters.category = 'all'; filters.priceCap = Math.ceil(maxPrice)"
              >
                Reset
              </button>
            </div>

            <div class="mb-4">
              <label class="form-label fw-semibold">Search</label>
              <input
                v-model="filters.search"
                type="search"
                class="form-control"
                placeholder="Search products..."
              />
            </div>

            <div class="mb-4">
              <label class="form-label fw-semibold">Category</label>
              <div class="list-group">
                <button
                  v-for="cat in categories"
                  :key="cat"
                  class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  :class="{ active: filters.category === cat }"
                  @click="filters.category = cat"
                >
                  <span class="text-capitalize">{{ cat }}</span>
                  <i v-if="filters.category === cat" class="bi bi-check2"></i>
                </button>
              </div>
            </div>

            <div>
              <div class="d-flex justify-content-between align-items-center">
                <label class="form-label fw-semibold mb-0">Max price</label>
                <span class="text-primary fw-semibold">{{ formatPrice(filters.priceCap || maxPrice) }}</span>
              </div>
              <input
                type="range"
                class="form-range"
                :min="0"
                :max="maxPrice"
                step="10"
                v-model.number="filters.priceCap"
              />
              <div class="d-flex justify-content-between text-muted small">
                <span>{{ formatPrice(0) }}</span>
                <span>{{ formatPrice(maxPrice) }}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <section class="col-lg-9">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="mb-0">Products</h4>
          <span class="text-secondary">{{ filteredProducts.length }} items</span>
        </div>

        <div v-if="filteredProducts.length" class="row g-4">
          <div class="col-sm-6 col-lg-4" v-for="product in filteredProducts" :key="product.id">
            <div class="card h-100 shadow-sm border-0">
              <img :src="product.imageUrl" class="card-img-top" :alt="product.name" />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title mb-1">{{ product.name }}</h5>
                <p class="text-muted small mb-2">{{ product.description }}</p>
                <div class="d-flex align-items-center gap-2 mb-3">
                  <span class="badge bg-light text-dark">{{ product.category }}</span>
                  <span class="fw-semibold text-primary">{{ formatPrice(product.price) }}</span>
                </div>
                <div class="mt-auto d-flex gap-2">
                  <RouterLink
                    :to="`/products/${product.id}`"
                    class="btn btn-outline-secondary btn-sm flex-grow-1"
                  >
                    Chi tiết
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center text-secondary py-5">
          <i class="bi bi-box-seam display-6 d-block mb-3"></i>
          <p class="mb-1">No products match your filters.</p>
          <button class="btn btn-primary btn-sm mt-2" @click="filters.search = ''; filters.category = 'all'; filters.priceCap = Math.ceil(maxPrice)">
            Clear filters
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
#mainImage {
  object-fit: cover;
  height: 200px !important;
}
.card-img, .card-img-bottom, .card-img-top {
    width: 100%;
    object-fit: cover;
    height: 300px;
}
</style>
