<script setup>
 import { defineProps } from 'vue';
 
 const props = defineProps ({
    Loai: String,
    Gia: Number,
    SoLuongNguoiDung: Number,
    DungLuong: Number,
    HoTro: String,
    DangKy: String
 })
</script>
<template>
    <div class="row">
        <div class="col col-md-4">
            <div class="card">
                <div class="card-header">
                    {{ props.Loai }}
                </div>
                <div class="card-body">
                    <h5 class="card-title">${{props.Gia}}/ mo</h5>
                    <p class="card-text">{{ props.SoLuongNguoiDung }} users included</p>
                    <p class="card-text">{{ props.DungLuong }} GB storage</p>
                    <p class="card-text">{{props.HoTro}}</p>
                    <p class="card-text">Help center access</p>
                    <button type="button" class="btn btn-outline-primary">{{ props.DangKy}}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.card-header {
    text-align: center;
    font-size: 20px;
    font-weight: 700;
}
.card-title {
    text-align: center;
    font-size: 25px;

}
.card-text {
    text-align: center;
}
.card-body {
    text-align: center;
}
</style>