import { createWebHistory, createRouter } from 'vue-router'

import LoginScreen from './pages/Login.vue'
import RegisterScreen from './pages/Register.vue'
import HomeView from './pages/Home.vue'
import ForgotPassword from './pages/ForgotPassword.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginScreen },
    { path: '/register', component: RegisterScreen },
     { path: '/forgot-password', component: ForgotPassword },
]

export const router = createRouter({
    history: createWebHistory(''),
    routes,
})