<script setup>
import { reactive } from 'vue'

const user = reactive({
    username: "",
    password: ""
})

</script>
<template>
    <form>
        <div class="form-group">
            <label for="exampleInputEmail1">Username</label>
            <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="user.username"
                placeholder="Enter email">
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input  type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-model="user.password">
        </div>
        <button type="submit" class="btn btn-primary mb-4">Submit</button> <br/>
         <span class="success" v-if="user.username ==='admin' && user.password ==='123456'"> login success</span>
        <span>{{ user.username }}</span> <br/>
         <span>{{ user.password }}</span>
    </form>
</template>
<style scoped>
.success{
    color: green;
}
</style>