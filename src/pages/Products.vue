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
              <h5 class="card-title mb-0">Bộ lọc</h5>
              <button
                class="btn btn-link text-decoration-none p-0"
                @click="filters.search = ''; filters.category = 'all'; filters.priceCap = Math.ceil(maxPrice)"
              >
                Đặt lại
              </button>
            </div>

            <div class="mb-4">
              <label class="form-label fw-semibold" for="product-search">Tìm kiếm</label>
              <input
                id="product-search"
                v-model="filters.search"
                type="search"
                class="form-control"
                placeholder="Tìm kiếm sản phẩm..."
                aria-label="Tìm kiếm sản phẩm"
              />
            </div>

            <div class="mb-4">
              <label class="form-label fw-semibold">Danh mục</label>
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
                <label class="form-label fw-semibold mb-0" for="price-range">Giá tối đa</label>
                <span class="text-primary fw-semibold">{{ formatPrice(filters.priceCap || maxPrice) }}</span>
              </div>
              <input
                id="price-range"
                type="range"
                class="form-range"
                :min="0"
                :max="maxPrice"
                step="10"
                v-model.number="filters.priceCap"
                :aria-label="`Giá tối đa: ${formatPrice(filters.priceCap || maxPrice)}`"
                aria-valuemin="0"
                :aria-valuemax="maxPrice"
                :aria-valuenow="filters.priceCap"
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
          <h4 class="mb-0">Sản phẩm</h4>
          <span class="text-secondary">{{ filteredProducts.length }} sản phẩm</span>
        </div>

        <div v-if="filteredProducts.length" class="row g-4">
          <div class="col-sm-6 col-lg-4" v-for="product in filteredProducts" :key="product.id">
            <div class="card product-card card-modern h-100 hover-lift">
              <div class="img-overlay-container">
                <img :src="product.imageUrl" class="card-img-top" :alt="product.name" />
                <div class="product-badge">
                  <span class="badge bg-primary">{{ product.category }}</span>
                </div>
                <div class="img-overlay">
                  <RouterLink :to="`/products/${product.id}`" class="btn btn-light btn-sm me-2">
                    <i class="bi bi-eye me-1"></i> Xem
                  </RouterLink>
                  <button class="btn btn-primary btn-sm">
                    <i class="bi bi-cart-plus"></i>
                  </button>
                </div>
              </div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title mb-1">{{ product.name }}</h5>
                <p class="text-muted small mb-2 flex-grow-1">{{ product.description }}</p>
                <div class="d-flex justify-content-between align-items-center mt-2">
                  <span class="h5 fw-bold text-primary mb-0">{{ formatPrice(product.price) }}</span>
                  <RouterLink
                    :to="`/products/${product.id}`"
                    class="btn btn-outline-primary btn-sm hover-scale"
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
          <p class="mb-1">Không có sản phẩm phù hợp với bộ lọc.</p>
          <button class="btn btn-primary btn-sm mt-2" @click="filters.search = ''; filters.category = 'all'; filters.priceCap = Math.ceil(maxPrice)">
            Xóa bộ lọc
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
  transition: transform 0.5s ease;
}

.product-card {
  overflow: hidden;
  border: none;
  cursor: pointer;
}

.product-card:hover .card-img-top {
  transform: scale(1.08);
}

.product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
}

.img-overlay {
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-overlay-container:hover .img-overlay {
  opacity: 1;
}

.list-group-item.active {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

.form-range::-webkit-slider-thumb {
  background: var(--bs-primary);
}

.form-range::-moz-range-thumb {
  background: var(--bs-primary);
}

/* Smooth animations */
.card {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
