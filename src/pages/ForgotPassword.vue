<script setup>
import { reactive } from 'vue'

const user = reactive({
    username: "",
    password: ""
})

</script>
<template>
     <h1>Quên mật khẩu</h1>
    <form>
        <div class="form-group">
            <label for="exampleInputEmail1">Tên đăng nhập</label>
            <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="user.username"
                placeholder="Nhập email">
            <small id="emailHelp" class="form-text text-muted">Chúng tôi sẽ không bao giờ chia sẻ email của bạn với người khác.</small>
        </div>
        <div class="form-group">
            <label for="exampleInputPassword1">Mật khẩu mới</label>
            <input  type="password" class="form-control" id="exampleInputPassword1" placeholder="Mật khẩu" v-model="user.password">
        </div>
        <button type="submit" class="btn btn-primary mb-4">Khôi phục</button> <br/>
         <span class="success" v-if="user.username ==='admin' && user.password ==='123456'">Khôi phục thành công</span>
        <span>{{ user.username }}</span> <br/>
         <span>{{ user.password }}</span>
    </form>
</template>
<style scoped>
.success{
    color: green;
}
</style>