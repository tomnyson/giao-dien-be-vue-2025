<script setup>
import { reactive } from 'vue'

const user = reactive({
    username: "",
    password: ""
})

</script>
<template>
    <h1>Profile</h1>
</template>
<style scoped>
.success{
    color: green;
}
</style>