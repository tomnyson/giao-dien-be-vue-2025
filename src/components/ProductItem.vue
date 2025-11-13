<script setup>
import { defineProps } from 'vue';
/**
 * const ->constant 
 * let  
 */
const props = defineProps({
    image: String,
    name: {
        type: String,
        default: "Sầu riêng"
    },
    price: {
        type: Number,
        default: 0
    }
})
</script>
<template>
    <div class="col-md-4 item">
        <img :src="props.image">
        <h3>{{ props.name }}</h3> <br>
        <h5>Giá:{{ props.price }}</h5>
        <button class="btn btn-primary">Thêm vào đơn</button>
    </div>
</template>
<style scoped>
h5{
  color: red;
  
}
img {
    width: 250px;
}
</style>