<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  },
  formatPrice: {
    type: Function,
    required: true
  },
  onSaveProduct: {
    type: Function,
    required: true
  },
  onDeleteProduct: {
    type: Function,
    required: true
  }
})

const productForm = reactive({
  id: '',
  name: '',
  description: '',
  price: 0,
  category: '',
  stock: 0,
  imageUrl: ''
})
const previewImage = ref('')
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: { levels: [2, 3] }
    }),
    Link.configure({
      openOnClick: true,
      autolink: true,
      linkOnPaste: true
    }),
    Image.configure({
      allowBase64: true,
      HTMLAttributes: {
        class: 'img-fluid rounded'
      }
    })
  ],
  content: productForm.description,
  editorProps: {
    attributes: {
      class: 'tiptap-editor'
    }
  },
  onUpdate({ editor }) {
    productForm.description = editor.getHTML()
  }
})

const isEditorReady = computed(() => !!editor.value)

const syncEditorContent = (content) => {
  if (!editor.value) return
  const html = content || ''
  if (editor.value.getHTML() !== html) {
    editor.value.commands.setContent(html || '')
  }
}

watch(editor, (instance) => {
  if (instance) syncEditorContent(productForm.description)
})

const toggleBold = () => editor.value?.chain().focus().toggleBold().run()
const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run()
const toggleStrike = () => editor.value?.chain().focus().toggleStrike().run()
const toggleHeading = (level) => editor.value?.chain().focus().toggleHeading({ level }).run()
const toggleOrderedList = () => editor.value?.chain().focus().toggleOrderedList().run()
const toggleBulletList = () => editor.value?.chain().focus().toggleBulletList().run()
const insertImage = () => {
  if (!editor.value) return
  const url = window.prompt('Nhập URL ảnh (có thể dùng base64 hoặc link)', '')
  if (url === null) return
  const src = url.trim()
  if (!src) return
  editor.value.chain().focus().setImage({ src }).run()
}
const setLink = () => {
  if (!editor.value) return
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('Nhập URL', previousUrl || '')
  if (url === null) return
  if (url === '') editor.value.chain().focus().unsetLink().run()
  else editor.value.chain().focus().setLink({ href: url }).run()
}
const clearFormat = () => editor.value?.chain().focus().unsetAllMarks().clearNodes().run()
const undo = () => editor.value?.chain().focus().undo().run()
const redo = () => editor.value?.chain().focus().redo().run()
const isActive = (type, attrs = {}) => editor.value?.isActive(type, attrs)

const resetProductForm = () => {
  Object.assign(productForm, {
    id: '',
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    imageUrl: ''
  })
  previewImage.value = ''
  if (editor.value) editor.value.commands.clearContent()
}

const handleSubmit = async () => {
  const saved = await props.onSaveProduct({ ...productForm })
  if (saved) resetProductForm()
}

const editProduct = (p) => {
  Object.assign(productForm, p)
  previewImage.value = p.imageUrl || ''
  syncEditorContent(p.description || '')
}

const deleteProduct = async (id) => {
  await props.onDeleteProduct(id)
}

const handleFileChange = (event) => {
  const [file] = event.target.files || []
  if (!file || !file.type?.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    productForm.imageUrl = reader.result
    previewImage.value = reader.result
  }
  reader.readAsDataURL(file)
  event.target.value = ''
}

const clearImage = () => {
  productForm.imageUrl = ''
  previewImage.value = ''
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="card shadow-sm tab-pane fade show active">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 mb-0">Sản phẩm</h2>
        <button class="btn btn-sm btn-outline-secondary" @click="resetProductForm">Làm mới</button>
      </div>
      <form class="row g-2 mb-3" @submit.prevent="handleSubmit">
        <div class="col-md-4">
          <label class="form-label small mb-1">Tên sản phẩm</label>
          <input v-model="productForm.name" type="text" class="form-control" placeholder="Tên" required />
        </div>
        <div class="col-md-2">
          <label class="form-label small mb-1">Giá</label>
          <input v-model.number="productForm.price" type="number" class="form-control" placeholder="Giá" min="0" step="0.01" />
        </div>
        <div class="col-md-2">
          <label class="form-label small mb-1">Kho</label>
          <input v-model.number="productForm.stock" type="number" class="form-control" placeholder="Kho" min="0" />
        </div>
        <div class="col-md-4">
          <label class="form-label small mb-1">Danh mục</label>
          <select v-model="productForm.category" class="form-select">
            <option value="">Chọn danh mục</option>
            <option v-for="c in categories" :key="c.id" :value="c.name">
              {{ c.name }}
            </option>
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label small mb-1">Ảnh sản phẩm</label>
          <div class="d-flex align-items-center gap-2">
            <label class="btn btn-outline-primary btn-sm mb-0">
              Chọn file
              <input
                type="file"
                accept="image/*"
                class="d-none"
                @change="handleFileChange"
              />
            </label>
            <input v-model="productForm.imageUrl" type="url" class="form-control" placeholder="Hoặc dán URL ảnh" />
          </div>
          <div v-if="previewImage" class="mt-2 d-flex align-items-center gap-2">
            <img :src="previewImage" alt="Preview" class="rounded border" style="width:64px;height:64px;object-fit:cover;">
            <button class="btn btn-outline-danger btn-sm" type="button" @click="clearImage">Xóa ảnh</button>
          </div>
        </div>
        <div class="col-md-12">
          <label class="form-label small mb-1">Mô tả</label>
          <div class="tiptap-wrapper">
            <div class="btn-group btn-group-sm flex-wrap tiptap-toolbar mb-2" role="group" aria-label="Định dạng văn bản">
              <button type="button" class="btn btn-outline-secondary" :class="{ active: isActive('heading', { level: 2 }) }" @click="toggleHeading(2)" :disabled="!isEditorReady">
                H2
              </button>
              <button type="button" class="btn btn-outline-secondary" :class="{ active: isActive('heading', { level: 3 }) }" @click="toggleHeading(3)" :disabled="!isEditorReady">
                H3
              </button>
              <button type="button" class="btn btn-outline-secondary" :class="{ active: isActive('bold') }" @click="toggleBold" :disabled="!isEditorReady">
                <strong>B</strong>
              </button>
              <button type="button" class="btn btn-outline-secondary" :class="{ active: isActive('italic') }" @click="toggleItalic" :disabled="!isEditorReady">
                <em>I</em>
              </button>
              <button type="button" class="btn btn-outline-secondary" :class="{ active: isActive('strike') }" @click="toggleStrike" :disabled="!isEditorReady">
                <s>S</s>
              </button>
              <button type="button" class="btn btn-outline-secondary" :class="{ active: isActive('orderedList') }" @click="toggleOrderedList" :disabled="!isEditorReady">
                1.
              </button>
              <button type="button" class="btn btn-outline-secondary" :class="{ active: isActive('bulletList') }" @click="toggleBulletList" :disabled="!isEditorReady">
                •
              </button>
              <button type="button" class="btn btn-outline-secondary" @click="insertImage" :disabled="!isEditorReady">
                Ảnh
              </button>
              <button type="button" class="btn btn-outline-secondary" @click="setLink" :disabled="!isEditorReady">
                Link
              </button>
              <button type="button" class="btn btn-outline-secondary" @click="clearFormat" :disabled="!isEditorReady">
                Xóa định dạng
              </button>
              <button type="button" class="btn btn-outline-secondary" @click="undo" :disabled="!isEditorReady">
                Hoàn tác
              </button>
              <button type="button" class="btn btn-outline-secondary" @click="redo" :disabled="!isEditorReady">
                Làm lại
              </button>
            </div>
            <EditorContent :editor="editor" class="tiptap-editor" />
          </div>
        </div>
        <div class="col-12 text-end">
          <button type="submit" class="btn btn-primary btn-sm">Lưu sản phẩm</button>
        </div>
      </form>

      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Kho</th>
              <th>Danh mục</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id">
              <td>{{ p.id }}</td>
              <td>{{ p.name }}</td>
              <td>{{ formatPrice(p.price) }}</td>
              <td>{{ p.stock }}</td>
              <td>{{ p.category }}</td>
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-secondary" @click="editProduct(p)">Sửa</button>
                  <button class="btn btn-outline-danger" @click="deleteProduct(p.id)">Xóa</button>
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

.tiptap-wrapper {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 0.5rem;
  background: #fff;
}

.tiptap-toolbar .btn {
  border-radius: 6px !important;
}

.tiptap-editor {
  min-height: 140px;
  outline: none;
  padding: 0.75rem;
}

.tiptap-editor p {
  margin-bottom: 0.75rem;
}

.tiptap-editor img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0.5rem 0;
}

.tiptap-editor ul,
.tiptap-editor ol {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}
</style>
