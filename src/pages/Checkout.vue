<script setup>
import { reactive, ref , onMounted, inject, computed} from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const share = inject('share')
console.log('share', share)
const API = import.meta.env.VITE_API_URL
let userid = 0;
const cart = ref([])
onMounted(async () => {
  await getcart()
})

const totalCart = computed(()=> {
  return share.carts.reduce((accumulator, currentValue) => accumulator + currentValue.quantity*currentValue.product.price, 0)
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

        const response = await axios.get(`${API}/carts?userId=${userid}&_embed=product&_embed=user`)
        if (response.data?.length) {
            cart.value = response.data;
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
/**
 * order
 * b1. lay thong khach tu form
 * b2. lay thong tin san pham -> carts
 * b3. tinh phi ship + vat + coupon (option)
 * b4 -> luu hoa don
 * b5 lay id hoa don => luu chi tiet hoa don
 * 
 */

</script>
<template>
    <main class="container my-5">
    <div class="row g-4">
      <!-- Left: Form -->
      <div class="col-lg-8">
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <p class="section-title mb-2">Thông tin liên hệ</p>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Tên</label>
                <input type="text" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Số điện thoại</label>
                <input type="tel" class="form-control" placeholder="+84..." />
              </div>
            </div>

            <hr class="my-4" />
            <p class="section-title mb-2">Địa chỉ giao hàng</p>
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label">Địa chỉ</label>
                <input type="text" class="form-control" required />
              </div>
              <div class="col-12">
                <label class="form-label">ghi chú</label>
                <input type="text" class="form-control" required />
              </div>
              <!-- <div class="col-md-6">
                <label class="form-label">Tỉnh/Thành phố</label>
                <input type="text" class="form-control" required />
              </div>
              <div class="col-md-3">
                <label class="form-label">Mã bưu chính</label>
                <input type="text" class="form-control" required />
              </div>
              <div class="col-md-3">
                <label class="form-label">Quốc gia</label>
                <select class="form-select" required>
                  <option value="">Chọn...</option>
                  <option>Việt Nam</option>
                  <option>Hoa Kỳ</option>
                  <option>Anh</option>
                  <option>Khác</option>
                </select>
              </div> -->
              <div class="col-12">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="same-address" checked />
                  <label class="form-check-label" for="same-address">
                    Sử dụng địa chỉ này cho thanh toán
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card shadow-sm">
          <div class="card-body">
            <p class="section-title mb-2">Phương thức thanh toán</p>
            <div class="row gy-3">
              <div class="col-md-4">
                <div class="form-check border rounded-3 p-3 h-100">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="zalopay"
                    checked
                  />
                  <label class="form-check-label d-block" for="zalopay">
                    COD
                  </label>
                  <small class="text-muted">Thanh toán khi nhận hàng</small>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check border rounded-3 p-3 h-100">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="momo"
                  />
                  <label class="form-check-label d-block" for="momo">
                    MoMo Pay
                  </label>
                  <small class="text-muted">Nhập mã đơn hoặc quét QR trên MoMo.</small>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check border rounded-3 p-3 h-100">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="vnpay"
                  />
                  <label class="form-check-label d-block" for="vnpay">
                    VNPay
                  </label>
                  <small class="text-muted">Hỗ trợ chuyển khoản qua VNPay QR.</small>
                </div>
              </div>
            </div>

            <div class="alert alert-info mt-3" role="alert">
              Sau khi bấm "Đặt hàng", mã QR tương ứng sẽ hiển thị để bạn quét bằng ví điện tử. Giao dịch an toàn, xác nhận trong vòng 1 phút.
            </div>

            <div class="row g-3 mt-1">
              <div class="col-12">
                <label class="form-label">Ghi chú đơn hàng (tuỳ chọn)</label>
                <textarea class="form-control" rows="3" placeholder="Ví dụ: giao giờ hành chính, mã thang máy..."></textarea>
              </div>
              <div class="col-12 mt-2">
                <a href="cart.html" class="btn btn-outline-secondary me-2">
                  ← Quay lại giỏ hàng
                </a>
                <button type="submit" class="btn btn-primary">
                  Đặt hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Order summary -->
      <div class="col-lg-4">
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <h2 class="h5 mb-3">Tóm tắt đơn hàng</h2>
           
            <ul  v-for="c in share.carts" :key="c.id" class="list-group list-group-flush mb-3">
              <li class="list-group-item px-0 d-flex justify-content-between align-items-center">
                <div>
                  <strong>{{ c.product?.name  }}</strong>
                  <p class="mb-0 small text-muted">{{ c.quantity }}</p>
                </div>
                <span>{{ c.product?.price * c.quantity}}</span>
              </li>
            </ul>
            <div class="d-flex justify-content-between mb-2">
              <span>Tạm tính</span>
              <span>{{ totalCart }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span>Thuế</span>
              <span>{{ Math.round(totalCart*0.1,2) }} đ</span>
            </div>
            <div class="input-group my-3">
              <input type="text" class="form-control" placeholder="Nhập mã giảm giá" />
              <button class="btn btn-outline-secondary" type="button">Áp dụng</button>
            </div>
            <hr />
            <div class="d-flex justify-content-between fw-bold mb-0">
              <span>Tổng cộng</span>
              <span>{{ totalCart + Math.round(totalCart*0.1,2)  }} đ</span>
            </div>
          </div>
        </div>

        <div class="card shadow-sm">
          <div class="card-body">
            <h2 class="h6">Cần hỗ trợ?</h2>
            <p class="text-muted small mb-3">
              Đội ngũ chăm sóc hoạt động 24/7 để giải đáp mọi thắc mắc giao hàng hoặc thanh toán.
            </p>
            <ul class="list-unstyled mb-0 small">
              <li>• Chat trực tuyến bất kỳ lúc nào</li>
              <li>• Email: support@simplecart.vn</li>
              <li>• Hotline: 1900 123 456</li>
            </ul>
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
