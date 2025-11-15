<script setup>
import { ref } from 'vue';
const name = ref("Nguyen Van A")
const dem = ref(0);
const showImage = ref(false)
const role = ref('admin')
const linkImage = ref('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu-kAOouyH324MVrd6LLwF0vmcVmu2omazbEDEFta35xT_sTZ7OiD7b8dE3VgFg1t_MVw&usqp=CAU')
const clsStatus = ref('alert-primary')

const products = ref([
    {
        "id": "SKU-001",
        "name": "Laptop ThinkPad X1",
        "description": "Laptop mỏng nhẹ, hiệu năng cao dành cho doanh nhân.",
        "price": 1200.00,
        "category": "Electronics",
        "stock": 50,
        "imageUrl": "https://picsum.photos/200/300"
    },
    {
        "id": "SKU-002",
        "name": "Điện thoại Galaxy S25",
        "description": "Điện thoại thông minh flagship với camera 108MP.",
        "price": 999.99,
        "category": "Electronics",
        "stock": 120,
        "imageUrl": "https://picsum.photos/200/300"
    },
    {
        "id": "SKU-003",
        "name": "Tai nghe không dây Pro",
        "description": "Tai nghe chống ồn chủ động, âm thanh chất lượng cao.",
        "price": 249.00,
        "category": "Accessories",
        "stock": 300,
        "imageUrl": "https://picsum.photos/200/300"
    },
    {
        "id": "SKU-004",
        "name": "Bàn phím cơ K8",
        "description": "Bàn phím cơ không dây, layout 80% với switch Brown.",
        "price": 89.50,
        "category": "Peripherals",
        "stock": 150,
        "imageUrl": "https://picsum.photos/200/300"
    }
])
/**
 * admin
 * guest
 * user
 */
//----------------------------------
const handleChangeName = () => {
    // alert('hello world')
    let result = prompt("Please enter your name:", "Guest");
    if (result != null) {
        name.value = result
    }

}

const handleIncrease = () => {
    dem.value++
    if (dem.value >= 5) {
        showImage.value = true
        clsStatus.value = 'alert-warning'
    }
}

const handleDecrease = () => {
    dem.value--

    if (dem.value < 5) {
        showImage.value = false
    }
}

/**
 * tang +
 * giam -
 */
</script>
<template>
    <h1>Bài về state (trạng thái)</h1>
    <p>{{ name }}</p>
    <button @click="handleChangeName" class="btn btn-primary">change name</button> <br />
    <div class="btn-group" role="group" aria-label="Basic example">
        <button @click="handleIncrease" type="button" class="btn btn-primary">+</button>
        <button type="button" @click="handleDecrease" class="btn btn-primary">-</button>

    </div>
    <p>{{ dem }}</p>
    <!-- <img v-show="showImage" class="img-fluid img-custom"
        src="https://cdn2.fptshop.com.vn/unsafe/800x0/llm_la_gi_1_d3b8ce7342.jpg" /> -->
    <div v-html="`<h1>Hello world</h1>`"></div>
    <div v-if="dem < 5">
        <img class="img-fluid img-custom" :src="linkImage" />
    </div>
    <div v-else-if="dem < 10">
        <img class="img-fluid img-custom"
            src="https://caodang.fpt.edu.vn/wp-content/uploads/2024/04/FPT-Polytechnic-HCM-giai-dau-vo-thuat-1.jpg" />
    </div>
    <div v-else>
        <img class="img-fluid"
            src="https://voz.vn/proxy.php?image=https%3A%2F%2Fi.chungta.vn%2F2022%2F06%2F21%2Ffpoly-1655782297.jpg&hash=87e2c360ed69268cbb5f1f918eaeb3f8" />
    </div>
    <div :class="`alert ${clsStatus} mt-5`" role="alert">
        This is a primary alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>
    <div class="row">
        <div class="col-md-3" v-for="item in products" :key="item.id">
            <div class="card" style="width: 18rem;">
                <img :src="item.imageUrl" class="card-img-top" :alt="item.name">
                <div class="card-body">
                    <h5 class="card-title">{{ item.name }}</h5>
                    <p class="card-text">
                    {{ item.description }}
                    </p>
                    <a href="#" class="btn btn-primary">detail</a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.img-custom {
    max-height: 250px;
    width: 100%;
    object-fit: cover;
}
.card img {
    height: 250px;
}
</style>