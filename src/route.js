import { createWebHistory, createRouter } from 'vue-router'

import LoginScreen from './pages/Login.vue'
import RegisterScreen from './pages/Register.vue'
import HomeView from './pages/Home.vue'
import ForgotPassword from './pages/ForgotPassword.vue'
import Profile from './pages/Profile.vue'
import pageNotFound from './pages/errors/404.vue'
import pagePermissonError from './pages/errors/503.vue'
import AdminPage from './pages/admin/admin.vue'
import Products from './pages/Products.vue'
import ProductDetail from './pages/ProductDetail.vue'
import Cart from './pages/Cart.vue'
import Checkout from './pages/Checkout.vue'
import News from './pages/News.vue'
import NewsDetail from './pages/NewsDetail.vue'

const routes = [
    { path: '/', name: 'home', component: HomeView, meta: { isLogin: false } },
    { path: '/products', name: 'products', component: Products, meta: { isLogin: false } },
    { path: '/products/:id', name: 'detail', component: ProductDetail, meta: { isLogin: false } },
    { path: '/news', name: 'news', component: News, meta: { isLogin: false } },
    { path: '/news/:slug', name: 'newsDetail', component: NewsDetail, meta: { isLogin: false } },
    { path: '/login', name: 'login', component: LoginScreen, meta: { isLogin: false } },
    { path: '/register', name: 'register', component: RegisterScreen, meta: { isLogin: false } },
    { path: '/forgot-password', meta: { isLogin: false }, name: 'forgot', component: ForgotPassword },
    { path: '/profile', meta: { isLogin: true }, name: 'profile', component: Profile },
    { path: '/carts', meta: { isLogin: true }, name: 'cart', component: Cart },
     { path: '/checkout', meta: { isLogin: true }, name: 'checkout', component: Checkout },
    { path: '/admin', meta: { isLogin: true, isAdmin: true }, name: 'admin', component: AdminPage },
    { path: '/503', name: 'permissionDenied', component: pagePermissonError },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: pageNotFound },
]

const router = createRouter({
    history: createWebHistory(''),
    routes,
})

router.beforeEach((to, from, next) => {
    const user = localStorage.getItem('ketqua')
    if (to.meta.isLogin && !user) {
        next({ name: 'login' })
        return
    }

    // If route requires admin, ensure we have a valid user and role
    if (to.meta.isAdmin) {
        if (!user) {
            next({ name: 'login' })
            return
        }

        try {
            const userParse = JSON.parse(user)
            if (userParse.role !== 'admin') {
                next({ name: 'permissionDenied' })
                return
            }
        } catch (error) {
            console.error('Invalid user data', error)
            next({ name: 'login' })
            return
        }
    }

    next()
})
export default router
