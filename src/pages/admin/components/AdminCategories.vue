<script setup>
import { reactive } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  onSaveCategory: {
    type: Function,
    required: true
  },
  onDeleteCategory: {
    type: Function,
    required: true
  }
})

const categoryForm = reactive({ id: '', name: '', description: '' })

const resetCategoryForm = () => Object.assign(categoryForm, { id: '', name: '', description: '' })

const handleSubmit = async () => {
  const saved = await props.onSaveCategory({ ...categoryForm })
  if (saved) resetCategoryForm()
}

const editCategory = (c) => {
  Object.assign(categoryForm, c)
}

const deleteCategory = async (id) => {
  await props.onDeleteCategory(id)
}
</script>

<template>
  <div class="card shadow-sm tab-pane fade show active">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 mb-0">Danh mục</h2>
        <button class="btn btn-sm btn-outline-secondary" @click="resetCategoryForm">Làm mới</button>
      </div>
      <form class="row g-2 mb-3" @submit.prevent="handleSubmit">
        <div class="col-md-4">
          <input v-model="categoryForm.name" type="text" class="form-control" placeholder="Tên" required />
        </div>
        <div class="col-md-8">
          <input v-model="categoryForm.description" type="text" class="form-control" placeholder="Mô tả" />
        </div>
        <div class="col-12 text-end">
          <button type="submit" class="btn btn-primary btn-sm">Lưu danh mục</button>
        </div>
      </form>

      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên</th>
              <th>Mô tả</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in categories" :key="c.id">
              <td>{{ c.id }}</td>
              <td>{{ c.name }}</td>
              <td>{{ c.description }}</td>
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-secondary" @click="editCategory(c)">Sửa</button>
                  <button class="btn btn-outline-danger" @click="deleteCategory(c.id)">Xóa</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
table th, table td {
  vertical-align: middle;
}
</style>
