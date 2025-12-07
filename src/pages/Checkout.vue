<script setup>
import { reactive, ref, onMounted, inject, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const share = inject('share')
const API = import.meta.env.VITE_API_URL

let userid = 0
const cart = ref([])

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

const totalCart = computed(() => {
  const carts = share?.carts && Array.isArray(share.carts) ? share.carts : cart.value
  if (!carts) return 0
  return carts.reduce((sum, item) => {
    const price = item.product?.price ?? item.price ?? 0
    return sum + Number(item.quantity || 0) * Number(price)
  }, 0)
})

const getCart = async () => {
  try {
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
    const subtotal = totalCart.value
    const shipFee = 0 // Free ship theo UI
    const vat = Math.round(subtotal * 0.1) // 10% VAT
    const discount = 0 // để sau xử lý coupon
    const total = subtotal + shipFee + vat - discount

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

    // Xoá giỏ hàng sau khi đặt hàng
    await Promise.all(
      carts.map(item => axios.delete(`${API}/carts/${item.id}`))
    )

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
