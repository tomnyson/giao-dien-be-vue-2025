<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { computed, inject } from 'vue'

const share = inject('share')
const router = useRouter()

const isLoggedIn = computed(() => !!(share && share.username))
const isAdmin = computed(() => isLoggedIn.value && share.role === 'admin')
const displayName = computed(() => (share && share.username) || '')

const handleLogout = () => {
  localStorage.removeItem('ketqua')
  if (share) {
    share.username = ''
    share.role = ''
  }
  router.push('/')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top" role="navigation" aria-label="Menu chính">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold d-flex align-items-center" to="/">
        <div class="brand-icon me-2">
          <i class="bi bi-shop"></i>
        </div>
        <span class="brand-text">VUEJS</span>
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-lg-center">
          <li class="nav-item">
            <RouterLink class="nav-link px-3" to="/" active-class="active">
              <i class="bi bi-house-door me-1"></i>Trang chủ
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link px-3" to="/products" active-class="active">
              <i class="bi bi-grid-3x3-gap me-1"></i>Sản phẩm
            </RouterLink>
          </li>
          <li class="nav-item dropdown">
            <button
              class="nav-link dropdown-toggle btn btn-link px-3"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-bag me-1"></i>Cửa hàng
            </button>
            <ul class="dropdown-menu dropdown-menu-modern">
              <li>
                <RouterLink class="dropdown-item" to="/products">
                  <i class="bi bi-grid me-2"></i>Tất cả sản phẩm
                </RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/news">
                  <i class="bi bi-newspaper me-2"></i>Tin tức
                </RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/carts">
                  <i class="bi bi-cart3 me-2"></i>Giỏ hàng
                </RouterLink>
              </li>
            </ul>
          </li>

          <li class="nav-item" v-if="isLoggedIn">
            <div class="dropdown">
              <button class="nav-link dropdown-toggle btn btn-link px-3 d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                <div class="avatar">
                  <i class="bi bi-person-circle"></i>
                </div>
                <span>{{ displayName }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end dropdown-menu-modern">
                <li>
                  <RouterLink class="dropdown-item" to="/profile">
                    <i class="bi bi-person me-2"></i>Hồ sơ
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/checkout">
                    <i class="bi bi-credit-card me-2"></i>Thanh toán
                  </RouterLink>
                </li>
                <li v-if="isAdmin">
                  <RouterLink class="dropdown-item" to="/admin">
                    <i class="bi bi-shield-lock me-2"></i>Quản trị
                  </RouterLink>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <button class="dropdown-item text-danger" type="button" @click="handleLogout">
                    <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          </li>

          <li class="nav-item" v-else>
            <RouterLink class="btn btn-primary btn-sm ms-lg-3 px-4" to="/login">
              <i class="bi bi-box-arrow-in-right me-1"></i>Đăng nhập
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.98) !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: var(--brand-orange);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.brand-text {
  color: var(--brand-orange);
  font-size: 1.5rem;
  letter-spacing: 1px;
}

.nav-link {
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.nav-link:hover {
  color: var(--bs-primary) !important;
}

.nav-link.active {
  color: var(--bs-primary) !important;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: var(--brand-orange);
  border-radius: 2px;
}

.avatar {
  width: 32px;
  height: 32px;
  background: var(--brand-orange);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.dropdown-menu-modern {
  border: none;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  border-radius: 12px;
  padding: 0.5rem;
  animation: fadeInDown 0.3s ease-out;
}

.dropdown-item {
  border-radius: 8px;
  padding: 0.6rem 1rem;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  transform: translateX(4px);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 991px) {
  .nav-link.active::after {
    display: none;
  }
  
  .navbar-collapse {
    margin-top: 1rem;
  }
}
</style>
