<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
const products = ref([])
const isLoading = ref(true)
/**
 * 1. call api -> wait data tra ve -> gan products -> render ra view
 * es6 async -> khai bao function
 *  await -> cho ket qua tra ve
 */
onMounted(() => {
    loadData()
})


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const loadData = async () => {
    try {
        isLoading.value = true
        await sleep(500)
        const response = await axios.get('http://localhost:3000/products')
        if (response.status === 200) {
            console.log(response.data)
            products.value = response.data
        }
        isLoading.value = false
    } catch (error) {
        throw error
    }

}

const handleDelete = async (id) => {
    const isConfirm = confirm('are you sure delete id:' + id)
    if (isConfirm) {
        const response = await axios.delete(`http://localhost:3000/products/${id}`)
        console.log(response)
        if (response.status === 200) {
            await loadData()
        }
    }

}
</script>
<template>

    <div class="row mt-5">
        <div class="center" v-show="isLoading">
            <div class="spinner-border" role="status">
                <span class="sr-only"></span>
            </div>
        </div>
        <h5 class="center" v-show="products.length==0 && !isLoading">item not found</h5>
        <div class="col-md-3" v-for="item in products" :key="item.id">
            <div class="card" style="width: 18rem;">
                <img :src="item.imageUrl" class="card-img-top" :alt="item.name">
                <div class="card-body">
                    <h5 class="card-title">{{ item.name }}</h5>
                    <p class="card-text">
                        {{ item.description }}
                    </p>
                    <a href="#" class="btn btn-primary">detail</a>
                    <button class="btn btn-danger" @click="handleDelete(item.id)">Remove</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.success {
    color: green;
}

.card img {
    height: 250px;
}

.center {
    text-align: center;
}
</style>