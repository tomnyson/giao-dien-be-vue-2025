<script setup>
import { reactive, ref, inject } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import axios from 'axios'

const share = inject('share')
const router = useRouter()
const API = import.meta.env.VITE_API_URL

const user = reactive({
    username: "",
    password: ""
})

const isLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

const handleSubmit = async () => {
    const username = user.username.trim()
    const password = user.password.trim()

    if (!username || !password) {
        errorMessage.value = 'Vui lòng nhập tên đăng nhập và mật khẩu'
        return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
        const response = await axios.get(`${API}/users`, {
            params: { username, password }
        })

        if (response.status === 200) {
            const matchedUser = response.data?.[0]

            if (matchedUser) {
                localStorage.setItem('ketqua', JSON.stringify(matchedUser))
                if (share) Object.assign(share, matchedUser)

                const redirectPath = matchedUser.role === 'admin' ? '/admin' : '/'
                router.push(redirectPath)
                return
            }

            errorMessage.value = 'Tên đăng nhập hoặc mật khẩu không đúng'
        }
    } catch (error) {
        errorMessage.value = 'Lỗi kết nối. Vui lòng thử lại.'
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="login-container">
        <div class="row justify-content-center">
            <div class="col-md-5 col-lg-4">
                <div class="card auth-card shadow-lg border-0 rounded-4 animate-fadeIn">
                    <div class="card-body p-4 p-md-5">
                        <!-- Logo/Title -->
                        <div class="text-center mb-4">
                            <div class="login-icon mb-3">
                                <i class="bi bi-person-circle"></i>
                            </div>
                            <h2 class="fw-bold mb-2 login-title">Chào mừng trở lại</h2>
                            <p class="text-muted small">Đăng nhập để tiếp tục sử dụng tài khoản</p>
                        </div>

                        <!-- Error Alert -->
                        <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show animate-slideDown" role="alert">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i>
                            {{ errorMessage }}
                            <button type="button" class="btn-close" @click="errorMessage = ''"></button>
                        </div>

                        <!-- Login Form -->
                        <form @submit.prevent="handleSubmit">
                            <div class="mb-3">
                                <label for="username" class="form-label fw-semibold">
                                    <i class="bi bi-person me-1"></i>Tên đăng nhập
                                </label>
                                <input 
                                    type="text" 
                                    class="form-control form-control-lg" 
                                    id="username"
                                    v-model="user.username" 
                                    placeholder="Nhập tên đăng nhập"
                                    :disabled="isLoading"
                                    required
                                >
                            </div>

                            <div class="mb-3">
                                <label for="password" class="form-label fw-semibold">
                                    <i class="bi bi-lock me-1"></i>Mật khẩu
                                </label>
                                <div class="input-group">
                                    <input 
                                        :type="showPassword ? 'text' : 'password'" 
                                        class="form-control form-control-lg" 
                                        id="password"
                                        v-model="user.password" 
                                        placeholder="Nhập mật khẩu"
                                        :disabled="isLoading"
                                        required
                                    >
                                    <button 
                                        class="btn btn-outline-secondary" 
                                        type="button"
                                        @click="showPassword = !showPassword"
                                        :disabled="isLoading"
                                        :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                                    >
                                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="rememberMe">
                                    <label class="form-check-label small" for="rememberMe">
                                        Ghi nhớ đăng nhập
                                    </label>
                                </div>
                                <RouterLink to="/forgot-password" class="text-decoration-none small">
                                    Quên mật khẩu?
                                </RouterLink>
                            </div>

                            <button 
                                type="submit" 
                                class="btn btn-primary btn-lg w-100 mb-3 btn-login"
                                :disabled="isLoading"
                            >
                                <span v-if="isLoading">
                                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Đang đăng nhập...
                                </span>
                                <span v-else>
                                    <i class="bi bi-box-arrow-in-right me-2"></i>Đăng nhập
                                </span>
                            </button>

                            <div class="text-center">
                                <span class="text-muted small">Chưa có tài khoản? </span>
                                <RouterLink to="/register" class="text-decoration-none fw-semibold">
                                    Tạo tài khoản
                                </RouterLink>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Social Login (Optional) -->
                <div class="text-center mt-4">
                    <p class="text-muted small mb-3">Hoặc đăng nhập với</p>
                    <div class="d-flex gap-2 justify-content-center">
                        <button class="btn btn-outline-secondary btn-sm social-btn" aria-label="Đăng nhập với Google">
                            <i class="bi bi-google"></i>
                        </button>
                        <button class="btn btn-outline-secondary btn-sm social-btn" aria-label="Đăng nhập với Facebook">
                            <i class="bi bi-facebook"></i>
                        </button>
                        <button class="btn btn-outline-secondary btn-sm social-btn" aria-label="Đăng nhập với GitHub">
                            <i class="bi bi-github"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.login-title {
    writing-mode: horizontal-tb;
    white-space: normal;
    letter-spacing: normal;
    text-align: center;
}

.login-icon {
    font-size: 4rem;
    color: var(--bs-primary);
    animation: bounce 2s ease-in-out infinite;
}

.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 1rem 3rem rgba(0,0,0,0.175) !important;
}

.form-control:focus {
    border-color: var(--bs-primary);
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}

.btn-login {
    background: var(--brand-orange);
    border: none;
    transition: all 0.3s ease;
}

.btn-login:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(238, 77, 45, 0.35);
}

.btn-login:active:not(:disabled) {
    transform: translateY(0);
}

.social-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.social-btn:hover {
    transform: scale(1.1);
    background-color: var(--bs-primary);
    color: white;
    border-color: var(--bs-primary);
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.6s ease-out;
}

.animate-slideDown {
    animation: slideDown 0.3s ease-out;
}

/* Mobile Responsiveness */
@media (max-width: 576px) {
    .login-container {
        padding: 1rem 0;
    }
    
    .card-body {
        padding: 2rem 1.5rem !important;
    }
    
    .login-icon {
        font-size: 3rem;
    }
}
</style>
