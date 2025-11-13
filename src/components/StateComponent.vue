<script setup>
import { ref } from 'vue';
const name = ref("Nguyen Van A")
const dem = ref(0);
const showImage = ref(false)
const role = ref('admin')
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

    <div v-if="dem < 5">
        <img class="img-fluid img-custom"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu-kAOouyH324MVrd6LLwF0vmcVmu2omazbEDEFta35xT_sTZ7OiD7b8dE3VgFg1t_MVw&usqp=CAU" />
    </div>
    <div v-else-if="dem < 10">
        <img class="img-fluid img-custom"
            src="https://caodang.fpt.edu.vn/wp-content/uploads/2024/04/FPT-Polytechnic-HCM-giai-dau-vo-thuat-1.jpg" />
    </div>
    <div v-else>
        <img class="img-fluid"
            src="https://voz.vn/proxy.php?image=https%3A%2F%2Fi.chungta.vn%2F2022%2F06%2F21%2Ffpoly-1655782297.jpg&hash=87e2c360ed69268cbb5f1f918eaeb3f8" />
    </div>
</template>

<style scoped>
.img-custom {
    max-height: 250px;
    width: 100%;
    object-fit: cover;
}
</style>