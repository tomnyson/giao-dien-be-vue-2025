<script setup>
import { reactive, ref, onMounted, inject, computed, watchEffect } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const share = inject('share')
const API = import.meta.env.VITE_API_URL

let userid = 0
const cart = ref([])
const isLoading = ref(false)

const orderForm = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  note: '',
  payment: 'cod',
  couponCode: ''
})

onMounted(async () => {
  await getCart()
})

watchEffect(() => {
  console.log('orderForm', orderForm)
})

const displayCarts = computed(() => {
  if (share && Array.isArray(share.carts) && share.carts.length) {
    return share.carts
  }
  return cart.value || []
})

const totalCart = computed(() => {
  if (!displayCarts.value) return 0
  return displayCarts.value.reduce((sum, item) => {
    const price = item.product?.price ?? item.price ?? 0
    return sum + Number(item.quantity || 0) * Number(price)
  }, 0)
})

const totals = computed(() => {
  const subtotal = totalCart.value
  const shipFee = 0
  const vat = Math.round(subtotal * 0.1)
  const discount = 0
  const total = subtotal + shipFee + vat - discount
  return { subtotal, shipFee, vat, discount, total }
})

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price || 0))

const getCart = async () => {
  try {
    isLoading.value = true
    const user = localStorage.getItem('ketqua')
    if (!user) {
      router.push('/login')
      return
    }

    const userObj = JSON.parse(user)
    userid = userObj.id

    const response = await axios.get(`${API}/carts?userId=${userid}&_embed=product&_embed=user`)
    const carts = response.data || []
    cart.value = carts

    if (share && typeof share === 'object') {
      // ghi đè danh sách giỏ hàng dùng chung
      share.carts = carts
    }
  } catch (error) {
    console.error('getCart error', error)
    throw error
  } finally {
    isLoading.value = false
  }
}

const clearUserCart = async (userId) => {
  const res = await axios.get(`${API}/carts?userId=${userId}`)
  const cartsToDelete = res.data || []

  if (cartsToDelete.length) {
    await Promise.all(cartsToDelete.map(item => axios.delete(`${API}/carts/${item.id}`)))
  }
}

const handleSubmit = async () => {
  try {
    // b1. Lấy thông tin khách từ form (validate cơ bản)
    if (!orderForm.name || !orderForm.phone || !orderForm.address) {
      alert('Vui lòng nhập đầy đủ họ tên, SĐT và địa chỉ')
      return
    }

    // Lấy user từ localStorage (phòng khi share chưa có id)
    const userStr = localStorage.getItem('ketqua')
    if (!userStr) {
      router.push('/login')
      return
    }
    const userObj = JSON.parse(userStr)
    userid = userObj.id

    // b2. Lấy thông tin sản phẩm từ giỏ
    const carts =
      share?.carts && Array.isArray(share.carts) && share.carts.length
        ? share.carts
        : cart.value

    if (!carts || !carts.length) {
      alert('Giỏ hàng đang trống')
      return
    }

    // b3. Tính phí ship + VAT + coupon (option – tạm thời chưa có logic coupon)
    const { subtotal, shipFee, vat, discount, total } = totals.value

    // b4. Lưu hóa đơn (orders)
    const orderPayload = {
      name: orderForm.name,
      email: orderForm.email,
      phone: orderForm.phone,
      address: orderForm.address,
      note: orderForm.note,
      userId: userid,
      status: 'pending',
      created: new Date().toISOString(),
      payment: orderForm.payment || 'cod',
      subtotal,
      shipFee,
      vat,
      discount,
      total
    }

    const orderRes = await axios.post(`${API}/orders`, orderPayload)

    if (!(orderRes.status === 201 || orderRes.status === 200)) {
      alert('Tạo hóa đơn thất bại')
      return
    }

    // b5. Lấy id hóa đơn => lưu chi tiết hóa đơn (orderItems)
    const orderId = orderRes.data.id

    const orderItemsPayload = carts.map(item => {
      const price = item.product?.price ?? item.price ?? 0
      const quantity = Number(item.quantity || 0)
      return {
        orderId,
        productId: item.productId || item.product?.id,
        quantity,
        price,
        lineTotal: price * quantity
      }
    })

    await Promise.all(
      orderItemsPayload.map(oi => axios.post(`${API}/orderItems`, oi))
    )

    // Xoá giỏ hàng sau khi đặt hàng (lấy theo userId để chắc chắn dọn sạch server)
    await clearUserCart(userid)

    if (share && typeof share === 'object') {
      share.carts = []
    }
    cart.value = []

    alert('Đặt hàng thành công!')
    router.push('/')
  } catch (error) {
    console.error('handleSubmit error', error)
    alert('Có lỗi xảy ra khi đặt hàng')
  }
}
</script>

<template>
  <main class="container my-5 checkout-page">
    <div class="row g-4 align-items-start">
      <section class="col-lg-7">
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h5 mb-0">Sản phẩm trong giỏ</h2>
              <RouterLink to="/carts" class="btn btn-sm btn-outline-secondary">Quay lại giỏ</RouterLink>
            </div>

            <div v-if="isLoading" class="text-center text-secondary py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="small mb-0 mt-2">Đang tải giỏ hàng...</p>
            </div>

            <div v-else>
              <div v-if="displayCarts.length" class="list-group list-group-flush">
                <div
                  v-for="item in displayCarts"
                  :key="item.id"
                  class="list-group-item d-flex gap-3 align-items-center"
                >
                  <img
                    :src="item.product?.imageUrl || 'https://via.placeholder.com/120x120?text=No+Image'"
                    class="checkout-thumb flex-shrink-0"
                    :alt="item.product?.name || 'Product image'"
                  />
                  <div class="flex-grow-1">
                    <p class="mb-1 fw-semibold">{{ item.product?.name || 'Sản phẩm' }}</p>
                    <p class="text-muted small mb-1">SL: {{ item.quantity }}</p>
                    <span class="fw-bold text-primary">{{ formatPrice(item.product?.price || item.price) }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-secondary py-4">
                <i class="bi bi-cart-x display-6 d-block mb-2"></i>
                <p class="mb-2">Giỏ hàng đang trống</p>
                <RouterLink to="/products" class="btn btn-primary btn-sm">Mua sắm ngay</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="col-lg-5">
        <form class="card shadow-sm" @submit.prevent="handleSubmit">
          <div class="card-body">
            <h2 class="h5 mb-3">Thông tin thanh toán</h2>

            <div class="mb-3">
              <label class="form-label">Họ tên *</label>
              <input v-model="orderForm.name" type="text" class="form-control" placeholder="Nguyễn Văn A" required />
            </div>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input v-model="orderForm.email" type="email" class="form-control" placeholder="you@example.com" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Số điện thoại *</label>
                <input v-model="orderForm.phone" type="tel" class="form-control" placeholder="0123 456 789" required />
              </div>
            </div>

            <div class="mb-3 mt-3">
              <label class="form-label">Địa chỉ giao hàng *</label>
              <textarea
                v-model="orderForm.address"
                rows="3"
                class="form-control"
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Ghi chú</label>
              <textarea
                v-model="orderForm.note"
                rows="2"
                class="form-control"
                placeholder="Ví dụ: gọi trước khi giao, gửi ngoài giờ hành chính..."
              />
            </div>

            <div class="mb-3">
              <label class="form-label d-block">Phương thức thanh toán</label>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="payment"
                  id="cod"
                  value="cod"
                  v-model="orderForm.payment"
                  checked
                />
                <label class="form-check-label" for="cod">Thanh toán khi nhận hàng (COD)</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="payment"
                  id="bank"
                  value="bank"
                  v-model="orderForm.payment"
                />
                <label class="form-check-label" for="bank">Chuyển khoản ngân hàng</label>
              </div>
            </div>

            <div class="card bg-light border-0 mb-3">
              <div class="card-body">
                <h3 class="h6 fw-semibold mb-3">Tóm tắt đơn hàng</h3>
                <div class="d-flex justify-content-between mb-2">
                  <span>Tạm tính</span>
                  <span class="fw-semibold">{{ formatPrice(totals.subtotal) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>VAT (10%)</span>
                  <span class="fw-semibold">{{ formatPrice(totals.vat) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Phí vận chuyển</span>
                  <span class="fw-semibold">{{ formatPrice(totals.shipFee) }}</span>
                </div>
                <hr />
                <div class="d-flex justify-content-between fw-bold">
                  <span>Tổng cộng</span>
                  <span class="text-primary">{{ formatPrice(totals.total) }}</span>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="isLoading || !displayCarts.length">
              Đặt hàng
            </button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<style scoped>
.checkout-thumb {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.checkout-page textarea {
  resize: vertical;
}
</style>
