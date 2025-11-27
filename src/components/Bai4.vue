<script setup>
import axios from 'axios';
import { ref, onMounted, reactive } from 'vue';
import { Modal } from 'bootstrap'

const products = ref([

])
const product = ref({
    id: '',
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    imageUrl: ''
})
const isLoading = ref(true)
const modalEl = ref(null)
const modelDetailEl = ref(null)

let modalInstance = null
let modalDetailInstance = null
const detail = reactive({
    id: '',
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    imageUrl: ''
})

/**
 * 1. call api -> wait data tra ve -> gan products -> render ra view
 * es6 async -> khai bao function
 *  await -> cho ket qua tra ve
 */
onMounted(() => {

    if (modalEl.value) {
        modalInstance = new Modal(modalEl.value)
    }
    if (modelDetailEl.value) {
        modalDetailInstance = new Modal(modelDetailEl.value)
    }

    loadData()
})


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const loadData = async () => {
    try {
        isLoading.value = true
        await sleep(500)
        const response = await axios.get('http://localhost:3000/products')
        if (response.status === 200) {
            console.log(response.data)
            products.value = response.data
        }
        isLoading.value = false
    } catch (error) {
        throw error
    }

}


const handleDelete = async (id) => {
    const isConfirm = confirm('are you sure delete id:' + id)
    if (isConfirm) {
        const response = await axios.delete(`http://localhost:3000/products/${id}`)
        console.log(response)
        if (response.status === 200) {
            await loadData()
        }
    }

}

const openCreateModal = () => {
    //   resetForm()
    //   state.isEditing = false
    modalInstance?.show()
}
const handleShowDetail = (id) => {
    // alert(id)
    const result = products.value.filter(item => item.id == id)
    Object.assign(detail, result[0]);
    modalDetailInstance?.show()
}
</script>
<template>

    <div class="row mt-5">

        <div class="center" v-show="isLoading">
            <div class="spinner-border" role="status">
                <span class="sr-only"></span>
            </div>
        </div>
        <div class="col-md-12">
            <button class="btn btn-primary mb-2" style="width: 200px;" @click="openCreateModal">
                + Add Product
            </button>
        </div>

        <!-- <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true"
            ref="modalEl">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form>
                        <legend>Create product</legend>
                        <div class="form-group">
                            <label for="exampleInputEmail1">ID</label>
                            <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                v-model="product.id" placeholder="Enter product ID">
                        </div>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Name</label>
                            <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                v-model="product.name" placeholder="Enter product ID">
                        </div>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Description</label>
                            <textarea class="form-control" v-model="product.description"></textarea>
                        </div>

                        <div class="form-group">
                            <label for="exampleInputEmail1">Price</label>
                            <input type="number" class="form-control" id="exampleInputEmail1"
                                aria-describedby="emailHelp" v-model="product.price" placeholder="Enter product ID">
                        </div>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Category</label>
                            <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                v-model="product.category" placeholder="Enter product category">
                        </div>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Stock</label>
                            <input type="number" class="form-control" id="exampleInputEmail1"
                                aria-describedby="emailHelp" v-model="product.stock" placeholder="Enter product ID">
                        </div>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Image</label>
                            <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                v-model="product.imageUrl" placeholder="Enter product imageUrl">
                        </div>
                        <button type="submit" class="btn btn-primary mb-4">Submit</button> <br />
                    </form>
                </div>
            </div>
        </div> -->

        <div class="modal fade" ref="modalEl" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Add Product</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="exampleInputEmail1">ID</label>
                                <input type="text" class="form-control" id="exampleInputEmail1"
                                    aria-describedby="emailHelp" v-model="product.id" placeholder="Enter product ID">
                            </div>
                            <div class="form-group">
                                <label for="exampleInputEmail1">Name</label>
                                <input type="text" class="form-control" id="exampleInputEmail1"
                                    aria-describedby="emailHelp" v-model="product.name" placeholder="Enter product ID">
                            </div>
                            <div class="form-group">
                                <label for="exampleInputEmail1">Description</label>
                                <textarea class="form-control" v-model="product.description"></textarea>
                            </div>

                            <div class="form-group">
                                <label for="exampleInputEmail1">Price</label>
                                <input type="number" class="form-control" id="exampleInputEmail1"
                                    aria-describedby="emailHelp" v-model="product.price" placeholder="Enter product ID">
                            </div>
                            <div class="form-group">
                                <label for="exampleInputEmail1">Category</label>
                                <input type="text" class="form-control" id="exampleInputEmail1"
                                    aria-describedby="emailHelp" v-model="product.category"
                                    placeholder="Enter product category">
                            </div>
                            <div class="form-group">
                                <label for="exampleInputEmail1">Stock</label>
                                <input type="number" class="form-control" id="exampleInputEmail1"
                                    aria-describedby="emailHelp" v-model="product.stock" placeholder="Enter product ID">
                            </div>
                            <div class="form-group">
                                <label for="exampleInputEmail1">Image</label>
                                <input type="text" class="form-control" id="exampleInputEmail1"
                                    aria-describedby="emailHelp" v-model="product.imageUrl"
                                    placeholder="Enter product imageUrl">
                            </div>
                            <!-- <button type="submit" class="btn btn-primary mb-4">Submit</button> <br /> -->
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" ref="modelDetailEl" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Add Product</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <span>Name</span>
                        <input type="text" name="" id="name" v-model="detail.name">
                        <span>Description</span>
                        <input type="text" value=""
                        id="description" v-model="detail.description">
                        <span>Price</span>
                        <input type="text" value="" id="price">
                        <span>Category</span>
                        <input type="text" value="" id="category">
                        <span>Stock</span>
                        <input type="text" value=""
                        id="stock">
                        <span>Image</span>
                        <input type="text" value=""
                        id="image">

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        <h5 class="center" v-show="products.length == 0 && !isLoading">item not found</h5>
        <div class="col-md-3" v-for="item in products" :key="item.id">
            <div class="card" style="width: 18rem;">
                <img :src="item.imageUrl" class="card-img-top" :alt="item.name">
                <div class="card-body">
                    <h5 class="card-title">{{ item.name }}</h5>
                    <p class="card-text">
                        {{ item.description }}
                    </p>
                    <a href="#" class="btn btn-primary" @click="handleShowDetail(item.id)"><i
                            class="bi bi-link"></i></a>
                    <button class="btn btn-danger" @click="handleDelete(item.id)"><i class="bi bi-trash"></i></button>
                    <button class="btn btn-info" @click="handleDelete(item.id)"><i class="bi bi-pencil"></i></button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.success {
    color: green;
}

.card img {
    height: 250px;
}

.center {
    text-align: center;
}
</style>