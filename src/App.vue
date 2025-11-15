<script setup>
import ProductItem from './components/ProductItem.vue'
import Pricing from './components/Pricing.vue';
import StateComponent from './components/StateComponent.vue';
import Bai4 from './components/Bai4.vue';
</script>

<template>
  <!-- <h1>sản phẩm nổi bật</h1> -->
  <!-- <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p> -->
  <div class="san-pham-noi-bat">
    <div class="container">
      <!-- <StateComponent/> -->
      <Bai4/>
      <!-- <Pricing Loai="Free" Gia="10" SoLuongNguoiDung="10" DungLuong="2" HoTro="Email support" DangKy="Sign up for free"/> -->
      <div class="row">
        <!-- <ProductItem
          image="https://product.hstatic.net/1000141988/product/621-37a6-40e5-9d78-d56ef6c05f41_c496454d980b492b838e01674264d1b3_large_d6f88af682ab4266ae7407efe6b62cdf_master.jpg"
          name="Sầu riêng Black Thorn Việt Nam A" price="958000" />
        <ProductItem
          image="https://product.hstatic.net/1000141988/product/621-37a6-40e5-9d78-d56ef6c05f41_c496454d980b492b838e01674264d1b3_large_d6f88af682ab4266ae7407efe6b62cdf_master.jpg"
          name="Sầu riêng cơm Sáu Hữu" price="958000" />
        <ProductItem
          image="https://product.hstatic.net/1000141988/product/s_u_ri_ng_c_m_s_u_h_u_91876ad7a70a49c49f7394091fc0aadc_master.jpg"
          name="Sầu riêng Black Thorn Việt Nam C" price="199750" /> -->
      </div>
    </div>

  </div>
</template>

<style scoped>
h1 {
  text-align: center;
  color: green;
}

h5 {
  color: red;

}

/* button{
  width: 100%;
  background-color: green;
  color: #d6cece;
  border-radius: 2px;
  border: 1px solid greenyellow;
}
.item{
  border-radius: 2px;
  border: 1px solid greenyellow;
}
h3{
  color: green;
} */
</style>
