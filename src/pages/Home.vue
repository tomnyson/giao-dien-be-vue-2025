<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const router = useRouter()

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

onMounted(() => {
  loadProducts()
})

const handleAddToCart = async (product) => {
  if (product.isPlaceholder) {
    return
  }

  const userStr = localStorage.getItem('ketqua')

  if (!userStr) {
    router.push('/login')
    return
  }

  const user = JSON.parse(userStr)

  if (product?.stock !== undefined && product.stock <= 0) {
    alert('Sản phẩm đã hết hàng')
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
      alert('Cập nhật giỏ hàng thành công')
    } else {
      await axios.post(`${API}/carts`, {
        userId: user.id,
        productId: product.id,
        quantity: 1,
      })
      alert('Thêm vào giỏ hàng thành công')
    }
  } catch (error) {
    console.error('Error when add to cart', error)
    alert('Không thể thêm vào giỏ hàng, vui lòng thử lại')
  }
}
</script>

<template>
  <div class="home-page">
    <section class="hero-section p-4 p-md-5 mb-5 rounded-4 text-white">
      <div class="row align-items-center g-4">
        <div class="col-lg-6">
          <p class="text-uppercase small text-white-50 mb-2">Hàng mới mỗi tuần</p>
          <h1 class="display-5 fw-bold mb-3">
            Mua sắm phong cách sống hiện đại trong một chạm.
          </h1>
          <p class="lead mb-4">
            Bộ sưu tập thiết bị, đồ decor và phụ kiện được tuyển chọn kỹ càng, giao nhanh
            toàn quốc chỉ từ 2 ngày.
          </p>
          <div class="d-flex flex-wrap gap-2">
            <RouterLink to="/products" class="btn btn-light btn-lg px-4">
              Xem sản phẩm nổi bật
            </RouterLink>
            <RouterLink to="/carts" class="btn btn-outline-light btn-lg px-4">
              Xem giỏ hàng
            </RouterLink>
          </div>
        </div>
        <div class="col-lg-6 text-center">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=60"
            class="img-fluid rounded-4 shadow hero-image"
            alt="Lifestyle products"
          />
        </div>
      </div>
    </section>

    <section class="mb-5">
      <div class="row g-3">
        <div class="col-md-4">
          <div class="mini-stat h-100 text-center">
            <h2 class="h4 mb-1">250+</h2>
            <p class="text-muted mb-0">Sản phẩm có sẵn</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="mini-stat h-100 text-center">
            <h2 class="h4 mb-1">Miễn phí</h2>
            <p class="text-muted mb-0">Giao hàng đơn từ 1.000.000đ</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="mini-stat h-100 text-center">
            <h2 class="h4 mb-1">4.9/5</h2>
            <p class="text-muted mb-0">Đánh giá khách hàng</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h4 mb-0">Danh mục gợi ý</h2>
        <RouterLink to="/products" class="btn btn-link text-decoration-none">Xem tất cả →</RouterLink>
      </div>
      <div class="row g-4">
        <div class="col-sm-6 col-lg-3" v-for="category in categories" :key="category.title">
          <div class="card category-card h-100">
            <div class="card-body">
              <span class="badge mb-3" :class="category.badge">{{ category.tag }}</span>
              <h3 class="h5">{{ category.title }}</h3>
              <p class="text-muted small mb-0">
                {{ category.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h4 mb-0">Sản phẩm bán chạy</h2>
        <RouterLink to="/products" class="btn btn-outline-secondary btn-sm">Chi tiết sản phẩm</RouterLink>
      </div>

      <div v-if="isLoading" class="text-center text-secondary py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 mb-0">Đang tải sản phẩm...</p>
      </div>

      <div v-else class="row g-4">
        <div class="col-md-6 col-lg-3" v-for="product in topProducts" :key="product.id">
          <div class="card product-card h-100">
            <img
              :src="product.imageUrl"
              class="card-img-top"
              :alt="product.name"
            />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="text-muted small mb-1">{{ product.description }}</p>
              <div class="d-flex justify-content-between align-items-center mt-auto">
                <span class="fw-bold">{{ formatPrice(product.price) }}</span>
                <div class="btn-group">
                  <RouterLink :to="`/products/${product.id}`" class="btn btn-outline-secondary btn-sm">
                    Xem
                  </RouterLink>
                  <button
                    class="btn btn-primary btn-sm"
                    type="button"
                    :disabled="product.isPlaceholder"
                    @click="handleAddToCart(product)"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-5">
      <div class="bg-dark text-white rounded-4 p-5 deal-banner">
        <div class="row align-items-center g-4">
          <div class="col-lg-8">
            <h2 class="h3">Flash Sale cuối tuần</h2>
            <p class="text-white-50 mb-0">
              Giảm đến 30% cho phụ kiện công nghệ, tặng nâng cấp giao hỏa tốc. Áp dụng đến Chủ nhật.
            </p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <RouterLink to="/products" class="btn btn-light btn-lg">Săn ưu đãi ngay</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white rounded-4 p-4 p-md-5 shadow-sm" id="newsletter">
      <div class="row align-items-center g-4">
        <div class="col-lg-6">
          <h2 class="h4">Nhận tin mới mỗi tuần</h2>
          <p class="text-muted mb-0">
            Đăng ký để nhận thông báo về sản phẩm về hàng, gợi ý set up góc làm việc.
          </p>
        </div>
        <div class="col-lg-6">
          <form class="d-flex flex-column flex-md-row gap-2" @submit.prevent>
            <input type="email" class="form-control form-control-lg" placeholder="Nhập email của bạn" required />
            <button class="btn btn-primary btn-lg" type="submit">Đăng ký</button>
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
  background: linear-gradient(135deg, #0d6efd, #6610f2);
}

.hero-image {
  max-width: 420px;
}

.category-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
}

.product-card img {
  height: 220px;
  object-fit: cover;
}

.mini-stat {
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 1.1rem;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.04);
}

.deal-banner {
  background: linear-gradient(135deg, #0b1739, #111827);
}
</style>
