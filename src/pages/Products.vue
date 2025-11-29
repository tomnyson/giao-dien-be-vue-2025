<script setup>
import { reactive, onMounted, ref } from 'vue'
import axios from 'axios';
import { RouterLink } from 'vue-router';

const API = import.meta.env.VITE_API_URL

const user = reactive({
    username: "",
    password: ""
})
const products = ref([])

onMounted(async()=>{
await loadProduct()
})

const loadProduct = async() => {
    try {
        const response = await axios.get(`${API}/products`)
        if (response.status === 200) {
            products.value = response.data
        }
        
    } catch (error) {
        
    }
}

</script>
<template>
     <main class="container mb-5" id="all-products">
    <div class="row g-4">
      <!-- Product cards -->
      <div class="col-sm-6 col-lg-3" v-for="product in products" :key="product.id">
        <div class="card h-100 product-card shadow-sm">
          <img :src="product.imageUrl" class="card-img-top" alt="Loa Bluetooth" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="text-muted small mb-1">{{ product.description }}</p>
            <span class="fw-semibold mb-3">{{ product.price }}</span>
            <div class="mt-auto d-flex gap-2">
              <RouterLink :to="`/products/${product.id}`" class="btn btn-outline-secondary btn-sm flex-grow-1">Chi tiết</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped>
.success{
    color: green;
}
</style>