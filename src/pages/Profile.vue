<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const API = import.meta.env.VITE_API_URL
const reviewAllowedStatuses = ['completed', 'delivered']

const user = reactive({
  id: '',
  username: '',
  role: ''
})

const orders = ref([])
const productsMap = ref({})
const isLoading = ref(false)
const reviewForms = reactive({})

const formattedOrders = computed(() => {
  return orders.value.map(order => {
    const items = (order.orderItems || []).map(item => {
      const product = productsMap.value[item.productId]
      return {
        ...item,
        productName: product?.name || item.productId,
        productImage: product?.imageUrl
      }
    })
    return { ...order, items }
  })
})

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price || 0))

const loadUser = () => {
  const userStr = localStorage.getItem('ketqua')
  if (!userStr) {
    router.push('/login')
    return null
  }
  const parsed = JSON.parse(userStr)
  Object.assign(user, parsed)
  return parsed
}

const loadProducts = async () => {
  const res = await axios.get(`${API}/products`)
  const map = {}
  res.data.forEach(p => { map[p.id] = p })
  productsMap.value = map
}

const loadOrders = async (userId) => {
  const res = await axios.get(`${API}/orders?userId=${userId}&_embed=orderItems&_sort=created&_order=desc`)
  orders.value = res.data || []
  initializeReviewForms()
}

const initializeReviewForms = () => {
  orders.value.forEach(order => {
    (order.orderItems || []).forEach(item => {
      if (!item?.id) return
      const form = ensureReviewForm(item.id)
      form.rating = item.rating || 5
      form.comment = item.comment || ''
    })
  })
}

const canReview = (order) => reviewAllowedStatuses.includes((order.status || '').toLowerCase())

const ensureReviewForm = (id) => {
  if (!id) return null
  if (!reviewForms[id]) {
    reviewForms[id] = {
      rating: 5,
      comment: '',
      saving: false,
      error: ''
    }
  }
  return reviewForms[id]
}

const saveReview = async (order, item) => {
  if (!item?.id || !canReview(order)) return
  const form = ensureReviewForm(item.id)
  if (!form) return

  const rating = Number(form.rating)
  if (!rating || rating < 1 || rating > 5) {
    form.error = 'Điểm đánh giá phải từ 1 - 5'
    return
  }

  form.saving = true
  form.error = ''
  try {
    const payload = {
      rating,
      comment: (form.comment || '').trim()
    }
    await axios.patch(`${API}/orderItems/${item.id}`, payload)

    // sync into local order item
    const targetOrder = orders.value.find(o => o.id === order.id)
    const targetItem = targetOrder?.orderItems?.find(i => i.id === item.id)
    if (targetItem) Object.assign(targetItem, payload)
  } catch (error) {
    console.error('Save review error', error)
    form.error = 'Lưu đánh giá thất bại, vui lòng thử lại.'
  } finally {
    form.saving = false
  }
}

onMounted(async () => {
  const current = loadUser()
  if (!current) return

  try {
    isLoading.value = true
    await Promise.all([loadProducts(), loadOrders(current.id)])
  } catch (error) {
    console.error('Profile load error', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="container my-5">
    <div class="row g-4">
      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h2 class="h5 mb-3">Thông tin tài khoản</h2>
            <p class="mb-1"><strong>Email:</strong> {{ user.username }}</p>
            <p class="mb-1"><strong>Vai trò:</strong> {{ user.role || 'user' }}</p>
            <p class="text-muted small mb-0">ID: {{ user.id }}</p>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h5 mb-0">Lịch sử đơn hàng</h2>
              <span class="text-secondary small">{{ orders.length }} đơn</span>
            </div>

            <div v-if="isLoading" class="text-center text-secondary py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-else>
                <div v-if="formattedOrders.length" class="list-group list-group-flush">
                  <div v-for="order in formattedOrders" :key="order.id" class="list-group-item py-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <p class="mb-1 fw-semibold">Đơn #{{ order.id }}</p>
                      <p class="text-muted small mb-0">{{ new Date(order.created).toLocaleString() }}</p>
                    </div>
                    <div class="text-end">
                      <span class="badge text-bg-secondary text-capitalize">{{ order.status }}</span>
                      <p class="mb-0 fw-bold text-primary">{{ formatPrice(order.total) }}</p>
                    </div>
                  </div>

                  <div class="d-flex flex-column gap-3">
                    <div
                      v-for="item in order.items"
                      :key="item.id || item.productId"
                      class="border rounded p-2"
                    >
                      <div class="d-flex align-items-center gap-3 mb-2">
                        <img
                          :src="item.productImage || 'https://via.placeholder.com/72x72?text=No+Img'"
                          class="order-thumb"
                          :alt="item.productName"
                        />
                        <div class="flex-grow-1">
                          <p class="mb-0 fw-semibold">{{ item.productName }}</p>
                          <p class="text-muted small mb-0">SL: {{ item.quantity }}</p>
                        </div>
                        <div class="text-end">
                          <p class="mb-0 fw-semibold">{{ formatPrice(item.price) }}</p>
                          <p class="text-muted small mb-0">Tổng: {{ formatPrice(item.lineTotal) }}</p>
                        </div>
                      </div>
                      
                      <div class="review-box mt-2 p-2 rounded bg-light">
                        <div class="d-flex align-items-center gap-2 flex-wrap">
                          <label class="small mb-0 fw-semibold">Đánh giá:</label>
                          <select
                            v-if="item?.id && ensureReviewForm(item.id)"
                            v-model.number="ensureReviewForm(item.id).rating"
                            class="form-select form-select-sm"
                            style="width: auto;"
                            :disabled="!canReview(order) || ensureReviewForm(item.id).saving"
                          >
                            <option v-for="n in 5" :key="n" :value="n">{{ n }} ⭐</option>
                          </select>
                          <span v-if="!canReview(order)" class="text-muted small">Chỉ đánh giá khi đơn đã hoàn thành.</span>
                        </div>
                        <textarea
                          v-if="item?.id && ensureReviewForm(item.id)"
                          v-model="ensureReviewForm(item.id).comment"
                          class="form-control form-control-sm mt-2"
                          rows="2"
                          placeholder="Chia sẻ cảm nhận về sản phẩm"
                          :disabled="!canReview(order) || ensureReviewForm(item.id).saving"
                        ></textarea>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                          <small v-if="item?.id && ensureReviewForm(item.id)?.error" class="text-danger">{{ ensureReviewForm(item.id).error }}</small>
                          <div class="ms-auto">
                            <button
                              class="btn btn-primary btn-sm"
                              type="button"
                              :disabled="!ensureReviewForm(item.id) || !canReview(order) || ensureReviewForm(item.id).saving"
                              @click="saveReview(order, item)"
                            >
                              <span v-if="ensureReviewForm(item.id)?.saving" class="spinner-border spinner-border-sm me-1"></span>
                              Lưu đánh giá
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center text-secondary py-4">
                <i class="bi bi-inbox display-6 d-block mb-2"></i>
                <p class="mb-0">Bạn chưa có đơn hàng nào.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.order-thumb {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 0.5rem;
}
</style>
