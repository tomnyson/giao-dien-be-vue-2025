<script setup>
import { reactive, ref , onMounted, inject} from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const API = import.meta.env.VITE_API_URL
let userid = 0;
const cart = ref([])
const share = inject('share')
onMounted(async () => {
  await getcart()
})
const getcart = async () => {
    try {
        const user = localStorage.getItem('ketqua')
        if (!user) {
            router.push('/login')
            return
        }

        const userObj = JSON.parse(user);
        userid = userObj.id;

        const response = await axios.get(`${API}/carts?userId=${userid}&_expand=product&_expand=user`)
        if (response.data?.length) {
            cart.value = response.data;
            share.carts = response.data;
        } else {
            cart.value = [];
        }
    }
    catch (error) {
        // console.log(error)
        throw error
    }
    return false
}

</script>
<template>
    <main class="container my-5">
        <div class="row g-4">
            <!-- Cart table -->
            <div class="col-lg-8">
                <div class="card shadow-sm mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h2 class="h5 mb-0">Sản phẩm của bạn ({{ cart.length }})</h2>
                            <RouterLink to="/products" class="btn btn-sm btn-outline-secondary">Tiếp tục mua sắm</RouterLink>
                        </div>
                        <div class="table-responsive">
                            <table class="table align-middle">
                                <thead>
                                    <tr>
                                        <th scope="col" style="min-width: 220px;">Sản phẩm</th>
                                        <th scope="col" class="text-center">Đơn giá</th>
                                        <th scope="col" class="text-center">Số lượng</th>
                                        <th scope="col" class="text-end">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Item 1 -->
                                    <tr v-for="c in cart" :key="c.id">
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=200&q=60"
                                                    class="cart-product-img me-3" alt="Wireless speaker" />
                                                <div>
                                                    <a href="detail.html" class="fw-semibold text-decoration-none">
                                                        {{ c.product?.name }}</a>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="text-center">{{ c.product?.price }}</td>
                                        <td class="text-center" style="max-width: 110px;">
                                            <input
                                                type="number"
                                                class="form-control form-control-sm text-center"
                                                :value="c.quantity"
                                                min="1"
                                            />
                                        </td>
                                        <td class="text-end">
                                            <button class="btn btn-sm btn-outline-danger">
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>                     
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Summary -->
            <div class="col-lg-4">
                <div class="card shadow-sm mb-4">
                    <div class="card-body">
                        <h2 class="h5 mb-3">Tóm tắt đơn hàng</h2>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Tạm tính</span>
                            <span>4.740.000đ</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Phí vận chuyển</span>
                            <span>Miễn phí</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Thuế</span>
                            <span>0đ</span>
                        </div>
                        <div class="input-group my-3">
                            <input type="text" class="form-control" placeholder="Nhập mã giảm giá" />
                            <button class="btn btn-outline-secondary" type="button">Áp dụng</button>
                        </div>
                        <hr />
                        <div class="d-flex justify-content-between mb-3 fw-bold">
                            <span>Tổng cộng</span>
                            <span>4.740.000đ</span>
                        </div>

                        <RouterLink to="/checkout" class="btn btn-primary w-100 mb-2">
                            Tiến hành thanh toán
                        </RouterLink>
                        <p class="small text-muted mb-0">
                            Khi đặt hàng bạn đã đồng ý với Điều khoản &amp; Chính sách của SimpleCart.
                        </p>
                    </div>
                </div>

                <div class="card shadow-sm">
                    <div class="card-body">
                        <h2 class="h6">Tùy chọn giao hàng</h2>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="shipping" id="standard" checked />
                            <label class="form-check-label" for="standard">
                                Tiêu chuẩn (3-4 ngày) &mdash; Miễn phí
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="shipping" id="express" />
                            <label class="form-check-label" for="express">
                                Hỏa tốc (1-2 ngày) &mdash; 90.000đ
                            </label>
                        </div>
                        <hr />
                        <label class="form-label">Ghi chú đơn hàng</label>
                        <textarea class="form-control" rows="3"
                            placeholder="VD: gọi trước khi giao, hướng dẫn bảo vệ..."></textarea>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<style scoped>
.success {
    color: green;
}
</style>
