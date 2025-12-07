<script setup>
import { onMounted, reactive, ref, watchEffect } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router';
import axios from 'axios';
const user = reactive({
    username: "",
    password: ""
})
const cart = reactive({
    id: "",
    userId: "",
    productsID: "",
    quantity: ""
})
const route = useRoute();
const router =useRouter()
const productDetail = ref({})
const productRelated = ref([])
const quantity = ref(1)

const API = import.meta.env.VITE_API_URL

const loadProductDetail = async (id) => {
    try {
        const response = await axios.get(`${API}/products/${id}`)
        console.log("detail", response)
        if (response.status === 200) {
            console.log("detail", response.data)
            productDetail.value = response.data
        }
    } catch (error) {
        throw error
    }
}

const loadProductRelative = async () => {
    try {
        const response = await axios.get(`${API}/products`)
        if (response.status === 200) {
            console.log("data", response.data)
               console.log("category", productDetail)
            productRelated.value = response.data.filter(item => item.category === productDetail.value.category )
        }

    } catch (error) {
        throw error

    }
}

// onMounted(async()=> {
//     const {id} = route.params
//     if(!id) {
//         return
//     }
//    await loadProductDetail(id)
//    await loadProductRelative(id)
// })

watchEffect(async() => {
     const {id} = route.params
    if(!id) {
        return
    }
   await loadProductDetail(id)
   await loadProductRelative(id)
})
/** 
 * thêm
 * b1. lay id cua sp hien tai
 * b2. lay id nguoi dung 
 * b3. chuyen sang trang dang nhap
 * b4. lay gia tri so luong neu so luong < 0 het hang
 * b5. luu vao object /carts -> payload o tren
 * 
 */
const handleAddCart = async (productId) => {
    // b1: lấy id của sản phẩm hiện tại (nhận từ tham số)
    console.log('productId', productId)

    // b2: lấy id người dùng từ localStorage
    const userStr = localStorage.getItem('ketqua')

    // b3: nếu chưa đăng nhập thì chuyển sang trang đăng nhập
    if (!userStr) {
        router.push('/login')
        return
    }

    const userObj = JSON.parse(userStr)

    // b4: lấy giá trị số lượng, nếu số lượng <= 0 hoặc lớn hơn tồn kho thì báo hết hàng
    const qty = Number(quantity.value)
    if (!qty || qty <= 0) {
        alert('Số lượng không hợp lệ')
        return
    }

    if (productDetail.value && typeof productDetail.value.stock === 'number') {
        if (qty > productDetail.value.stock) {
            alert('Sản phẩm không đủ số lượng trong kho')
            return
        }
        if (productDetail.value.stock <= 0) {
            alert('Sản phẩm đã hết hàng')
            return
        }
    }

    // b5: lưu vào object /carts -> payload để gửi lên db.json
    const payload = {
        productId: productId,
        userId: userObj.id,
        quantity: qty,
    }

    try {
        // Kiểm tra đã có cart của user với productId này chưa (db.json: /carts?userId=&productId=)
        const response = await axios.get(`${API}/carts?userId=${userObj.id}&productId=${productId}`)

        if (response.status === 200) {
            if (response.data.length > 0) {
                // Đã tồn tại sản phẩm trong giỏ -> update quantity
                const currentCart = response.data[0]
                const idCart = currentCart.id

                const responseUpdateCart = await axios.put(`${API}/carts/${idCart}`, {
                    ...currentCart,
                    quantity: Number(currentCart.quantity) + qty,
                })

                if (responseUpdateCart.status === 200) {
                    alert('Cập nhật giỏ hàng thành công')
                }
            } else {
                // Chưa có -> tạo mới
                const responseAddCart = await axios.post(`${API}/carts`, payload)
                if (responseAddCart.status === 201 || responseAddCart.status === 200) {
                    alert('Thêm vào giỏ hàng thành công')
                }
            }
        }
    } catch (error) {
        console.error('Error when add to cart', error)
        alert('Có lỗi khi thêm vào giỏ hàng')
    }
}
</script>
<template>
    <main class="container my-4">
        <div class="row g-4 align-items-start">
            <!-- LEFT: IMAGES -->
            <div class="col-md-6">
                <div class="card shadow-sm">
                    <img id="mainImage" :src="productDetail.imageUrl" class="card-img-top product-main-img" alt="Wireless speaker" />
                    <div class="card-body">
                        <div class="row g-2">
                            <div class="col-3">
                                <img :src="productDetail.imageUrl"
                                    class="img-fluid thumbnail-img active" alt="Speaker front"
                                    onclick="changeImage(this)" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT: INFO -->
            <div class="col-md-6">
                <h1 class="h3 mb-2">{{ productDetail.name }}</h1>
                <p class="text-muted mb-1">{{ productDetail.id }}</p>
                <div class="d-flex align-items-center mb-3">
                    quantity: (<strong>{{ productDetail.stock }}</strong>   )
                </div>

                <div class="mb-3">
                    <span class="h2 text-primary">{{ productDetail.price }}</span>
                </div>

                <p>
                    {{ productDetail.description }}
                </p>

                <ul class="list-unstyled">
                    <li>• Kết nối đa thiết bị cùng lúc</li>
                    <li>• Lưới nhôm tái chế thân thiện môi trường</li>
                    <li>• Kích hoạt trợ lý giọng nói</li>
                </ul>

                <!-- <div class="mb-3">
          <span class="fw-semibold me-2">Màu sắc:</span>
          <div class="btn-group" role="group">
            <button class="btn btn-outline-secondary btn-sm active" type="button">Navy</button>
            <button class="btn btn-outline-secondary btn-sm" type="button">Sand</button>
            <button class="btn btn-outline-secondary btn-sm" type="button">Charcoal</button>
          </div>
        </div> -->

                <!-- Quantity + Add to cart -->
                <form class="mt-4" @submit.prevent="handleAddCart(productDetail.id)">
                    <div class="row g-3 align-items-center mb-3">
                        <div class="col-auto">
                            <label for="quantity" class="col-form-label fw-semibold">Quantity</label>
                        </div>
                        <div class="col-auto">
                            <input type="number" id="quantity" class="form-control" v-model="quantity" min="1" :max="productDetail.stock" />
                        </div>
                    </div>

                    <div class="d-flex flex-wrap gap-2">
                        <input type="submit" value=" Thêm vào giỏ"  class="btn btn-primary btn-lg"/>
                        <a href="checkout.html" class="btn btn-outline-secondary btn-lg">
                            Mua ngay
                        </a>
                    </div>
                </form>

                <!-- <div class="row g-3 mt-4">
          <div class="col-md-6">
            <div class="delivery-card h-100">
              <h6 class="fw-semibold mb-1">Vận chuyển</h6>
              <p class="text-muted small mb-0">
                Miễn phí giao tiêu chuẩn 3-4 ngày, có thể chọn giao nhanh khi thanh toán.
              </p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="delivery-card h-100">
              <h6 class="fw-semibold mb-1">Bảo hành</h6>
              <p class="text-muted small mb-0">
                Bảo hành 12 tháng và đổi trả miễn phí trong 30 ngày.
              </p>
            </div>
          </div>
        </div> -->

                <!-- Extra info (tabs) -->
                <div class="mt-4">
                    <ul class="nav nav-tabs" id="detailTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="desc-tab" data-bs-toggle="tab" data-bs-target="#desc"
                                type="button" role="tab">
                                Mô tả
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="spec-tab" data-bs-toggle="tab" data-bs-target="#spec"
                                type="button" role="tab">
                                Thông số
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="review-tab" data-bs-toggle="tab" data-bs-target="#review"
                                type="button" role="tab">
                                Đánh giá
                            </button>
                        </li>
                    </ul>
                    <div class="tab-content border-start border-end border-bottom p-3 bg-white">
                        <div class="tab-pane fade show active" id="desc" role="tabpanel">
                            <p>
                                Tặng kèm dây USB-C bọc dù, túi vải bảo vệ và ứng dụng chỉnh EQ riêng.
                            </p>
                            <p class="mb-0">
                                Hướng dẫn sử dụng tiếng Việt & tiếng Anh.
                            </p>
                        </div>
                        <div class="tab-pane fade" id="spec" role="tabpanel">
                            <ul>
                                <li>Trọng lượng: 480 g</li>
                                <li>Kích thước: 18 x 7 x 7 cm</li>
                                <li>Pin: 5200 mAh, sạc USB-C</li>
                                <li>Kết nối: Bluetooth 5.3, cổng AUX 3.5mm</li>
                            </ul>
                        </div>
                        <div class="tab-pane fade" id="review" role="tabpanel">
                            <div class="mb-3">
                                <strong>Lan Nguyễn</strong>
                                <p class="mb-1 text-warning">★★★★★</p>
                                <p class="text-muted">
                                    Âm thanh mạnh mẽ so với kích thước, pin trụ cả chuyến đi Vũng Tàu.
                                </p>
                            </div>
                            <div>
                                <strong>Minh Trần</strong>
                                <p class="mb-1 text-warning">★★★★☆</p>
                                <p class="text-muted">
                                    Thiết kế đẹp, ghép nối nhanh. Ước gì có chế độ bass mạnh hơn nữa.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Related products -->
        <section class="mt-5">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="h4 mb-0">Sản phẩm liên quan</h3>
                <a href="detail.html" class="btn btn-outline-secondary btn-sm">Xem cửa hàng</a>
            </div>
            <div class="row g-4">
                <div v-for="item in productRelated" :key="item.id" class="col-md-3 col-6">
                    <div class="card h-100 shadow-sm">
                        <img :src="item.imageUrl"
                            class="card-img-top" alt="Soundbar" />
                        <div class="card-body">
                            <h6 class="card-title">{{ item.name }}</h6>
                            <p class="mb-1 fw-bold">{{ item.price }}</p>
                            <RouterLink :to="`/products/${item.id}`" class="btn btn-sm btn-outline-primary">Xem</RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

</template>
<style scoped>
.success {
    color: green;
}
.card-img-top {
    height: 300px;
    object-fit: cover;
}
</style>