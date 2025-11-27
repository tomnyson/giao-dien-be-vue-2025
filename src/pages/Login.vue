<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const user = reactive({
    username: "",
    password: ""
})

const userAPI = ref([]
)


const handleSubmit = async () => {
    /**
     * b1. kt tài khoản mk
     * b1.1 -> call API get thông tin trả về -> lấy hết và xử lý js 
     
     * b1.2 => check xem có dữ liệu username và password trùng với array trả vể
     * b1.3 => lưu vào local storage
     * b1.4 => truyền về trang home
     */
    try {
        const response = await axios.get('http://localhost:3000/users')
        console.log(response)
        if (response.status == 200) {
            console.log(response.data)
            userAPI.value = response.data
            const ketqua = userAPI.value.filter(item => item.username == user.username && item.password == user.password)
            if (ketqua.length > 0) {
                alert('login success')
                localStorage.setItem('ketqua', JSON.stringify(user))
                router.push('/')
                return false
            }
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
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit">
        <div class="form-group">
            <label for="exampleInputEmail1">Username</label>
            <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                v-model="user.username" placeholder="Enter email">
        </div>
        <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"
                v-model="user.password">
        </div>
        <button type="submit" class="btn btn-primary mb-4">Login</button> <br />
        <span class="success" v-if="user.username === 'admin' && user.password === '123456'"> login success</span>
        <span>{{ user.username }}</span> <br />
        <span>{{ user.password }}</span>
        <RouterLink class="nav-link" to="/register">create new account</RouterLink>
        <RouterLink class="nav-link" to="/forgot-password">forgot password</RouterLink>
    </form>
</template>
<style scoped>
.success {
    color: green;
}
</style>