<script setup>
import { reactive } from 'vue'

const props = defineProps({
  news: {
    type: Array,
    default: () => []
  },
  onSaveNews: {
    type: Function,
    required: true
  },
  onDeleteNews: {
    type: Function,
    required: true
  }
})

const form = reactive({
  id: '',
  title: '',
  slug: '',
  category: '',
  author: '',
  date: '',
  cover: '',
  excerpt: '',
  content: ''
})

const slugify = (str = '') =>
  str
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')

const resetForm = () => {
  Object.assign(form, {
    id: '',
    title: '',
    slug: '',
    category: '',
    author: '',
    date: '',
    cover: '',
    excerpt: '',
    content: ''
  })
}

const handleSubmit = async () => {
  if (!form.title) {
    alert('Vui lòng nhập tiêu đề')
    return
  }
  const payload = { ...form }
  if (!payload.slug) payload.slug = slugify(payload.title)
  const saved = await props.onSaveNews(payload)
  if (saved) resetForm()
}

const editNews = (item) => {
  Object.assign(form, item)
}

const deleteNews = async (id) => {
  await props.onDeleteNews(id)
}
</script>

<template>
  <div class="card shadow-sm tab-pane fade show active">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 mb-0">Bài viết</h2>
        <button class="btn btn-sm btn-outline-secondary" type="button" @click="resetForm">Làm mới</button>
      </div>

      <form class="row g-2 mb-3" @submit.prevent="handleSubmit">
        <div class="col-md-6">
          <label class="form-label small mb-1">Tiêu đề</label>
          <input v-model="form.title" type="text" class="form-control" placeholder="Tiêu đề bài viết" required />
        </div>
        <div class="col-md-3">
          <label class="form-label small mb-1">Slug</label>
          <input v-model="form.slug" type="text" class="form-control" placeholder="slug-tu-dong" />
        </div>
        <div class="col-md-3">
          <label class="form-label small mb-1">Danh mục</label>
          <input v-model="form.category" type="text" class="form-control" placeholder="Danh mục" />
        </div>
        <div class="col-md-3">
          <label class="form-label small mb-1">Tác giả</label>
          <input v-model="form.author" type="text" class="form-control" placeholder="Tên tác giả" />
        </div>
        <div class="col-md-3">
          <label class="form-label small mb-1">Ngày</label>
          <input v-model="form.date" type="date" class="form-control" />
        </div>
        <div class="col-md-6">
          <label class="form-label small mb-1">Ảnh bìa</label>
          <input v-model="form.cover" type="url" class="form-control" placeholder="URL ảnh bìa" />
        </div>
        <div class="col-12">
          <label class="form-label small mb-1">Tóm tắt</label>
          <textarea v-model="form.excerpt" rows="2" class="form-control" placeholder="Mô tả ngắn"></textarea>
        </div>
        <div class="col-12">
          <label class="form-label small mb-1">Nội dung</label>
          <textarea v-model="form.content" rows="6" class="form-control" placeholder="Nội dung HTML hoặc văn bản"></textarea>
        </div>
        <div class="col-12 text-end">
          <button type="submit" class="btn btn-primary btn-sm">Lưu bài viết</button>
        </div>
      </form>

      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Danh mục</th>
              <th>Ngày</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in news" :key="article.id">
              <td>{{ article.id }}</td>
              <td>{{ article.title }}</td>
              <td>{{ article.category }}</td>
              <td>{{ new Date(article.date).toLocaleDateString() }}</td>
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-secondary" type="button" @click="editNews(article)">Sửa</button>
                  <button class="btn btn-outline-danger" type="button" @click="deleteNews(article.id)">Xóa</button>
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
