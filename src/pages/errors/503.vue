<script setup>
import { ref } from 'vue'

// Hàm xử lý tải lại trang
const handleReload = () => {
    window.location.reload()
}

// Hàm xử lý quay về trang chủ (nếu cần)
const goHome = () => {
    window.location.href = '/'
}
</script>

<template>
    <div class="maintenance-container">
        <div class="content">
            <div class="illustration">
                <svg class="gear gear-large" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
                </svg>
                <svg class="gear gear-small" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
                </svg>
            </div>

            <h1 class="error-code">503</h1>
            <h2 class="error-title">Hệ thống đang bảo trì</h2>
            <p class="error-desc">
                Chúng tôi đang nâng cấp server để mang lại trải nghiệm tốt hơn.<br>
                Vui lòng quay lại sau ít phút.
            </p>

            <div class="actions">
                <button @click="handleReload" class="btn btn-primary">
                    Thử lại ngay
                </button>
                <button @click="goHome" class="btn btn-secondary">
                    Về trang chủ
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

/* Thiết lập Layout chính */
.maintenance-container {
    font-family: 'Inter', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    color: #2c3e50;
    text-align: center;
    padding: 20px;
}

.content {
    background: rgba(255, 255, 255, 0.9);
    padding: 3rem;
    border-radius: 24px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    max-width: 500px;
    width: 100%;
    backdrop-filter: blur(10px);
}

/* Typography */
.error-code {
    font-size: 5rem;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(45deg, #3498db, #8e44ad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
}

.error-title {
    font-size: 1.5rem;
    margin: 10px 0 20px;
    font-weight: 600;
    color: #34495e;
}

.error-desc {
    color: #7f8c8d;
    line-height: 1.6;
    margin-bottom: 2rem;
}

/* Animation cho bánh răng */
.illustration {
    position: relative;
    height: 120px;
    margin-bottom: 20px;
}

.gear {
    fill: #34495e;
    position: absolute;
    opacity: 0.8;
}

.gear-large {
    width: 80px;
    height: 80px;
    left: 50%;
    transform: translateX(-80%);
    animation: spin 4s linear infinite;
    fill: #3498db;
}

.gear-small {
    width: 50px;
    height: 50px;
    left: 50%;
    top: 35px;
    transform: translateX(10%);
    animation: spin-reverse 4s linear infinite;
    fill: #8e44ad;
}

@keyframes spin {
    100% { transform: translateX(-80%) rotate(360deg); }
}

@keyframes spin-reverse {
    100% { transform: translateX(10%) rotate(-360deg); }
}

/* Buttons */
.actions {
    display: flex;
    gap: 15px;
    justify-content: center;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.95rem;
}

.btn-primary {
    background: #3498db;
    color: white;
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.btn-primary:hover {
    background: #2980b9;
    transform: translateY(-2px);
}

.btn-secondary {
    background: #ecf0f1;
    color: #34495e;
}

.btn-secondary:hover {
    background: #bdc3c7;
    transform: translateY(-2px);
}

/* Mobile responsive */
@media (max-width: 480px) {
    .content {
        padding: 2rem;
    }
    .error-code {
        font-size: 4rem;
    }
    .actions {
        flex-direction: column;
    }
}
</style>