<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from '../composables/useToast'
import SkeletonLoader from '../components/SkeletonLoader.vue'

const API = import.meta.env.VITE_API_URL
const router = useRouter()
const { success, error, warning } = useToast()

const products = ref([])
const isLoading = ref(false)

const categories = [
  { title: 'Trang trí nhà', badge: 'text-bg-primary', tag: 'Living', description: 'Mang lại cảm giác ấm áp cho từng góc nhỏ.' },
  { title: 'Thiết bị thông minh', badge: 'text-bg-success', tag: 'Tech', description: 'Phụ kiện, thiết bị đeo tiện lợi.' },
  { title: 'Làm đẹp & chăm sóc', badge: 'text-bg-warning', tag: 'Wellness', description: 'Đồ chăm sóc bản thân dễ mang theo.' },
  { title: 'Du lịch dã ngoại', badge: 'text-bg-danger', tag: 'Outdoor', description: 'Balo, bình nước, bộ phụ kiện tiện lợi.' },
]

const fallbackProducts = [
  {
    id: 'placeholder-1',
    name: 'Loa Bluetooth mini',
    description: 'Màu navy · Gọn nhẹ',
    price: 1590000,
    imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=60',
    isPlaceholder: true,
  },
  {
    id: 'placeholder-2',
    name: 'Tai nghe chống ồn',
    description: 'Hỗ trợ chống ồn chủ động',
    price: 2990000,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=60',
    isPlaceholder: true,
  },
  {
    id: 'placeholder-3',
    name: 'Balo da du lịch',
    description: 'Chống nước, nhiều ngăn',
    price: 3150000,
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=60',
    isPlaceholder: true,
  },
  {
    id: 'placeholder-4',
    name: 'Combo cây xanh',
    description: 'Làm xanh bàn làm việc',
    price: 790000,
    imageUrl: 'https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=600&q=60',
    isPlaceholder: true,
  },
]

const topProducts = computed(() => {
  if (products.value.length) {
    return products.value.slice(0, 4)
  }
  return fallbackProducts
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price || 0))
}

const loadProducts = async () => {
  try {
    isLoading.value = true
    const response = await axios.get(`${API}/products`)
    if (response.status === 200) {
      products.value = response.data
    }
  } catch (error) {
    console.error('Failed to load products', error)
  } finally {
    isLoading.value = false
  }
}

const getCategoryColor = (index) => {
  const colors = ['text-primary', 'text-success', 'text-warning', 'text-danger']
  return colors[index % colors.length]
}

onMounted(() => {
  loadProducts()
})

const handleAddToCart = async (product) => {
  if (product.isPlaceholder) {
    return
  }

  const userStr = localStorage.getItem('ketqua')

  if (!userStr) {
    warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
    setTimeout(() => router.push('/login'), 1500)
    return
  }

  const user = JSON.parse(userStr)

  if (product?.stock !== undefined && product.stock <= 0) {
    error('Sản phẩm đã hết hàng')
    return
  }

  try {
    const response = await axios.get(`${API}/carts?userId=${user.id}&productId=${product.id}`)
    const hasCart = response.status === 200 && response.data?.length

    if (hasCart) {
      const current = response.data[0]
      await axios.put(`${API}/carts/${current.id}`, {
        ...current,
        quantity: Number(current.quantity) + 1,
      })
      success('Cập nhật giỏ hàng thành công!')
    } else {
      await axios.post(`${API}/carts`, {
        userId: user.id,
        productId: product.id,
        quantity: 1,
      })
      success('Thêm vào giỏ hàng thành công!')
    }
  } catch (err) {
    console.error('Error when add to cart', err)
    error('Không thể thêm vào giỏ hàng, vui lòng thử lại')
  }
}
</script>

<template>
  <div class="home-page">
    <!-- Enhanced Hero Section -->
    <section class="hero-section p-4 p-md-5 mb-5 rounded-4 text-white animate-fade-in">
      <div class="row align-items-center g-4">
        <div class="col-lg-6 animate-slide-in-left">
          <span class="badge badge-modern bg-light text-primary mb-3">
            <i class="bi bi-star-fill me-1"></i> Hàng mới mỗi tuần
          </span>
          <h1 class="display-4 fw-bold mb-3">
            Mua sắm phong cách<br />
            <span class="text-gradient">sống hiện đại</span>
          </h1>
          <p class="lead mb-4">
            Bộ sưu tập thiết bị, đồ decor và phụ kiện được tuyển chọn kỹ càng, 
            giao nhanh toàn quốc chỉ từ 2 ngày.
          </p>
          <div class="d-flex flex-wrap gap-3">
            <RouterLink to="/products" class="btn btn-light btn-lg px-4 hover-lift">
              <i class="bi bi-grid-3x3-gap me-2"></i>Xem sản phẩm
            </RouterLink>
            <RouterLink to="/carts" class="btn btn-outline-light btn-lg px-4 hover-scale">
              <i class="bi bi-cart3 me-2"></i>Giỏ hàng
            </RouterLink>
          </div>
        </div>
        <div class="col-lg-6 text-center animate-slide-in-right">
          <div class="hero-image-container">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=60"
              class="img-fluid rounded-4 shadow-lg hero-image"
              alt="Lifestyle products"
            />
            <div class="floating-badge badge-1">
              <i class="bi bi-lightning-charge-fill text-warning"></i>
              <span class="ms-1">Flash Sale</span>
            </div>
            <div class="floating-badge badge-2">
              <i class="bi bi-truck text-success"></i>
              <span class="ms-1">Giao nhanh</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="mb-5">
      <div class="row g-4">
        <div class="col-md-4 animate-fade-in-up animate-delay-1">
          <div class="mini-stat card-modern h-100 text-center p-4">
            <div class="stat-icon mb-3">
              <i class="bi bi-box-seam"></i>
            </div>
            <h2 class="h3 fw-bold mb-1">250+</h2>
            <p class="text-muted mb-0">Sản phẩm có sẵn</p>
          </div>
        </div>
        <div class="col-md-4 animate-fade-in-up animate-delay-2">
          <div class="mini-stat card-modern h-100 text-center p-4">
            <div class="stat-icon mb-3">
              <i class="bi bi-truck"></i>
            </div>
            <h2 class="h3 fw-bold mb-1">Miễn phí</h2>
            <p class="text-muted mb-0">Giao hàng đơn từ 1.000.000đ</p>
          </div>
        </div>
        <div class="col-md-4 animate-fade-in-up animate-delay-3">
          <div class="mini-stat card-modern h-100 text-center p-4">
            <div class="stat-icon mb-3">
              <i class="bi bi-star-fill"></i>
            </div>
            <h2 class="h3 fw-bold mb-1">4.9/5</h2>
            <p class="text-muted mb-0">Đánh giá khách hàng</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="mb-5 animate-fade-in-up">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h3 fw-bold mb-1">Danh mục gợi ý</h2>
          <p class="text-muted mb-0">Khám phá các danh mục phổ biến</p>
        </div>
        <RouterLink to="/products" class="btn btn-link text-decoration-none">
          Xem tất cả <i class="bi bi-arrow-right ms-1"></i>
        </RouterLink>
      </div>
      <div class="row g-4">
        <div class="col-sm-6 col-lg-3" v-for="(category, index) in categories" :key="category.title">
          <div class="card category-card card-modern h-100 hover-lift" :class="'animate-scale-in animate-delay-' + (index + 1)">
            <div class="card-body p-4">
              <div class="category-icon mb-3">
                <i class="bi bi-circle-fill" :class="getCategoryColor(index)"></i>
              </div>
              <span class="badge badge-modern mb-3" :class="category.badge">{{ category.tag }}</span>
              <h3 class="h5 fw-semibold">{{ category.title }}</h3>
              <p class="text-muted small mb-0">
                {{ category.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Top Products Section -->
    <section class="mb-5 animate-fade-in-up">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="h3 fw-bold mb-1">Sản phẩm bán chạy</h2>
          <p class="text-muted mb-0">Được yêu thích nhất trong tháng</p>
        </div>
        <RouterLink to="/products" class="btn btn-gradient text-white">
          Xem tất cả <i class="bi bi-arrow-right ms-1"></i>
        </RouterLink>
      </div>

      <div v-if="isLoading" class="row g-4">
        <div class="col-md-6 col-lg-3" v-for="i in 4" :key="i">
          <SkeletonLoader type="card" />
        </div>
      </div>

      <div v-else class="row g-4">
        <div class="col-md-6 col-lg-3" v-for="(product, index) in topProducts" :key="product.id">
          <div class="card product-card card-modern h-100 hover-lift" :class="'animate-fade-in-up animate-delay-' + (index + 1)">
            <div class="img-overlay-container">
              <img
                :src="product.imageUrl"
                class="card-img-top"
                :alt="product.name"
              />
              <div class="img-overlay">
                <RouterLink :to="`/products/${product.id}`" class="btn btn-light btn-sm">
                  <i class="bi bi-eye me-1"></i> Xem chi tiết
                </RouterLink>
              </div>
            </div>
            <div class="card-body d-flex flex-column p-3">
              <h5 class="card-title mb-2">{{ product.name }}</h5>
              <p class="text-muted small mb-3 flex-grow-1">{{ product.description }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="h5 fw-bold text-primary mb-0">{{ formatPrice(product.price) }}</span>
                <button
                  class="btn btn-primary btn-sm hover-scale"
                  type="button"
                  :disabled="product.isPlaceholder"
                  @click="handleAddToCart(product)"
                  :aria-label="`Thêm ${product.name} vào giỏ hàng`"
                >
                  <i class="bi bi-cart-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Deal Banner -->
    <section class="mb-5 animate-fade-in-up">
      <div class="deal-banner rounded-4 p-4 p-md-5 position-relative overflow-hidden">
        <div class="position-absolute top-0 end-0 w-50 h-100 opacity-25">
          <i class="bi bi-lightning-charge-fill display-1"></i>
        </div>
        <div class="row align-items-center g-4 position-relative">
          <div class="col-lg-8">
            <span class="badge bg-warning text-dark mb-3 animate-pulse">
              <i class="bi bi-fire me-1"></i> HOT DEAL
            </span>
            <h2 class="h2 fw-bold text-white mb-3">Flash Sale cuối tuần</h2>
            <p class="text-white-50 mb-0 lead">
              Giảm đến 30% cho phụ kiện công nghệ, tặng nâng cấp giao hỏa tốc. 
              Áp dụng đến Chủ nhật.
            </p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <RouterLink to="/products" class="btn btn-light btn-lg px-4 hover-lift">
              <i class="bi bi-lightning-charge-fill me-2"></i>Săn ngay
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter-section card-modern p-4 p-md-5 animate-fade-in-up">
      <div class="row align-items-center g-4">
        <div class="col-lg-6">
          <div class="d-flex align-items-center mb-3">
            <div class="newsletter-icon me-3">
              <i class="bi bi-envelope-heart"></i>
            </div>
            <div>
              <h2 class="h4 fw-bold mb-1">Nhận tin mới mỗi tuần</h2>
              <p class="text-muted mb-0">
                Đăng ký để nhận thông báo về sản phẩm mới
              </p>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <form class="newsletter-form" @submit.prevent>
            <div class="input-group input-group-lg">
              <input 
                type="email" 
                class="form-control" 
                placeholder="Nhập email của bạn" 
                required 
              />
              <button class="btn btn-primary px-4" type="submit">
                <i class="bi bi-send-fill"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  color: #1f2933;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect fill="rgba(255,255,255,0.05)" width="50" height="50"/></svg>');
  background-size: 50px 50px;
  opacity: 0.3;
}

.text-gradient {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-image-container {
  position: relative;
}

.hero-image {
  max-width: 500px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.5s ease;
}

.hero-image:hover {
  transform: scale(1.05) rotate(2deg);
}

.floating-badge {
  position: absolute;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  font-size: 0.875rem;
  font-weight: 600;
  animation: float 3s ease-in-out infinite;
}

.badge-1 {
  top: 10%;
  right: -5%;
}

.badge-2 {
  bottom: 15%;
  left: -5%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.stat-icon {
  font-size: 3rem;
  color: var(--bs-primary);
  opacity: 0.2;
}

.mini-stat {
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.mini-stat:hover {
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2) !important;
}

.mini-stat:hover .stat-icon {
  opacity: 1;
  transform: scale(1.1);
  transition: all 0.3s ease;
}

.category-card {
  border: 2px solid transparent;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  border-color: var(--bs-primary);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.category-icon {
  font-size: 2rem;
}

.product-card {
  border: none;
  background: white;
  overflow: hidden;
  cursor: pointer;
}

.product-card .card-img-top {
  height: 220px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .card-img-top {
  transform: scale(1.1);
}

.deal-banner {
  background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%);
  border: none;
}

.newsletter-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: none;
}

.newsletter-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.newsletter-form .input-group {
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.newsletter-form .form-control {
  border: none;
  padding-left: 1.5rem;
}

.newsletter-form .form-control:focus {
  box-shadow: none;
}

.newsletter-form .btn {
  border-radius: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1.5rem !important;
  }

  .floating-badge {
    display: none;
  }

  .hero-image {
    max-width: 100%;
  }

  .display-4 {
    font-size: 2rem;
  }

  .stat-icon {
    font-size: 2rem;
  }

  .newsletter-icon {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }
}
</style>
