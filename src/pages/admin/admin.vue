<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AdminStats from './components/AdminStats.vue'
import AdminProducts from './components/AdminProducts.vue'
import AdminCategories from './components/AdminCategories.vue'
import AdminOrders from './components/AdminOrders.vue'
import AdminUsers from './components/AdminUsers.vue'
import AdminNews from './components/AdminNews.vue'

const router = useRouter()
const API = import.meta.env.VITE_API_URL

const products = ref([])
const categories = ref([])
const orders = ref([])
const users = ref([])
const news = ref([])
const productsMap = ref({})
const isLoading = ref(false)
const currentTab = ref('products')
const tabList = [
  { key: 'products', label: 'Sản phẩm' },
  { key: 'categories', label: 'Danh mục' },
  { key: 'orders', label: 'Đơn hàng' },
  { key: 'stats', label: 'Thống kê' },
  { key: 'users', label: 'Người dùng' },
  { key: 'news', label: 'Bài viết' },
]

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price || 0))
const generateId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 7)}`
const slugify = (str = '') =>
  str
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')

const ensureAdmin = () => {
  const userStr = localStorage.getItem('ketqua')
  if (!userStr) {
    router.push('/login')
    return null
  }
  const user = JSON.parse(userStr)
  if (user.role !== 'admin') {
    router.push('/503')
    return null
  }
  return user
}

const loadAll = async () => {
  try {
    isLoading.value = true
    const [productRes, categoryRes, orderRes, userRes, newsRes] = await Promise.all([
      axios.get(`${API}/products`),
      axios.get(`${API}/categories`),
      axios.get(`${API}/orders?_sort=created&_order=desc&_embed=orderItems`),
      axios.get(`${API}/users`),
      axios.get(`${API}/news?_sort=date&_order=desc`)
    ])
    const productList = productRes.data || []
    products.value = productList
    categories.value = categoryRes.data || []
    orders.value = orderRes.data || []
    users.value = userRes.data || []
    news.value = newsRes.data || []
    const map = {}
    productList.forEach(p => { map[p.id] = p })
    productsMap.value = map
  } catch (error) {
    console.error('Load admin data error', error)
  } finally {
    isLoading.value = false
  }
}

const saveProduct = async (product) => {
  if (!product.name) {
    alert('Vui lòng nhập tên sản phẩm')
    return false
  }
  try {
    if (product.id) {
      await axios.put(`${API}/products/${product.id}`, product)
    } else {
      const newProduct = { ...product, id: generateId('SKU') }
      await axios.post(`${API}/products`, newProduct)
    }
    await loadAll()
    return true
  } catch (error) {
    console.error('Save product error', error)
  }
  return false
}

const deleteProduct = async (id) => {
  if (!confirm('Xóa sản phẩm này?')) return
  try {
    await axios.delete(`${API}/products/${id}`)
    await loadAll()
  } catch (error) {
    console.error('Delete product error', error)
  }
}

const saveCategory = async (category) => {
  if (!category.name) {
    alert('Vui lòng nhập tên danh mục')
    return false
  }
  try {
    if (category.id) {
      await axios.put(`${API}/categories/${category.id}`, category)
    } else {
      const newCategory = { ...category, id: generateId('cat') }
      await axios.post(`${API}/categories`, newCategory)
    }
    await loadAll()
    return true
  } catch (error) {
    console.error('Save category error', error)
  }
  return false
}

const deleteCategory = async (id) => {
  if (!confirm('Xóa danh mục này?')) return
  try {
    await axios.delete(`${API}/categories/${id}`)
    await loadAll()
  } catch (error) {
    console.error('Delete category error', error)
  }
}

const saveUser = async (user) => {
  if (!user.username || !user.password) {
    alert('Vui lòng nhập username và password')
    return false
  }
  try {
    const payload = { ...user }
    if (!payload.id) payload.id = crypto.randomUUID().slice(0, 8)
    const exists = users.value.find(u => u.id === payload.id)
    if (exists) await axios.put(`${API}/users/${payload.id}`, payload)
    else await axios.post(`${API}/users`, payload)
    await loadAll()
    return true
  } catch (error) {
    console.error('Save user error', error)
  }
  return false
}

const deleteUser = async (id) => {
  if (!confirm('Xóa người dùng này?')) return
  try {
    await axios.delete(`${API}/users/${id}`)
    await loadAll()
  } catch (error) {
    console.error('Delete user error', error)
  }
}

const updateOrderStatus = async (orderId, status) => {
  if (!orderId) return false
  try {
    await axios.patch(`${API}/orders/${orderId}`, { status })
    await loadAll()
    return true
  } catch (error) {
    console.error('Update order status error', error)
  }
  return false
}

const deleteOrder = async (id) => {
  if (!confirm('Xóa đơn hàng này?')) return
  try {
    await axios.delete(`${API}/orders/${id}`)
    await loadAll()
  } catch (error) {
    console.error('Delete order error', error)
  }
}

const saveNews = async (article) => {
  if (!article.title) {
    alert('Vui lòng nhập tiêu đề')
    return false
  }
  try {
    const payload = { ...article }
    if (!payload.slug) payload.slug = slugify(payload.title)
    if (!payload.id) payload.id = generateId('news')
    const exists = news.value.find(n => n.id === payload.id)
    if (exists) await axios.put(`${API}/news/${payload.id}`, payload)
    else await axios.post(`${API}/news`, payload)
    await loadAll()
    return true
  } catch (error) {
    console.error('Save news error', error)
  }
  return false
}

const deleteNews = async (id) => {
  if (!confirm('Xóa bài viết này?')) return
  try {
    await axios.delete(`${API}/news/${id}`)
    await loadAll()
  } catch (error) {
    console.error('Delete news error', error)
  }
}

onMounted(() => {
  const user = ensureAdmin()
  if (user) {
    loadAll()
  }
})
</script>

<template>
  <main class="container my-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h4 mb-0">Admin Dashboard</h1>
      <span class="text-secondary small">Quản trị sản phẩm, danh mục, đơn hàng, người dùng</span>
    </div>

    <div v-if="isLoading" class="text-center text-secondary py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <ul class="nav nav-tabs mb-3">
        <li v-for="tab in tabList" :key="tab.key" class="nav-item">
          <button
            class="nav-link"
            :class="{ active: currentTab === tab.key }"
            type="button"
            @click="currentTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </li>
      </ul>

      <div class="tab-content">
        <AdminStats
          v-if="currentTab === 'stats'"
          :orders="orders"
          :format-price="formatPrice"
        />

        <AdminProducts
          v-else-if="currentTab === 'products'"
          :products="products"
          :categories="categories"
          :format-price="formatPrice"
          :on-save-product="saveProduct"
          :on-delete-product="deleteProduct"
        />

        <AdminCategories
          v-else-if="currentTab === 'categories'"
          :categories="categories"
          :on-save-category="saveCategory"
          :on-delete-category="deleteCategory"
        />

        <AdminOrders
          v-else-if="currentTab === 'orders'"
          :orders="orders"
          :format-price="formatPrice"
          :products-map="productsMap"
          :on-update-status="updateOrderStatus"
          :on-delete-order="deleteOrder"
        />

        <AdminUsers
          v-else-if="currentTab === 'users'"
          :users="users"
          :on-save-user="saveUser"
          :on-delete-user="deleteUser"
        />

        <AdminNews
          v-else-if="currentTab === 'news'"
          :news="news"
          :on-save-news="saveNews"
          :on-delete-news="deleteNews"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.nav-tabs .nav-link {
  font-weight: 600;
}
</style>
