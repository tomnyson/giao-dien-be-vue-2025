<script setup>
import { reactive, computed, ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'

const state = reactive({
  users: [
    { id: 1, name: 'Alice', email: 'alice@mail.com' },
    { id: 2, name: 'Bob', email: 'bob@mail.com' },
  ],
  form: {
    id: null,
    name: '',
    email: '',
  },
  isEditing: false,
  nextId: 3,
})

const totalUsers = computed(() => state.users.length)

// Bootstrap modal instance
const modalEl = ref(null)
let modalInstance = null

onMounted(() => {
  if (modalEl.value) {
    modalInstance = new Modal(modalEl.value)
  }
})

const openCreateModal = () => {
  resetForm()
  state.isEditing = false
  modalInstance?.show()
}

const openEditModal = (user) => {
  state.isEditing = true
  state.form.id = user.id
  state.form.name = user.name
  state.form.email = user.email
  modalInstance?.show()
}

const closeModal = () => {
  modalInstance?.hide()
  resetForm()
}

// CREATE
const createUser = () => {
  if (!state.form.name || !state.form.email) return

  state.users.push({
    id: state.nextId++,
    name: state.form.name,
    email: state.form.email,
  })

  closeModal()
}

// UPDATE
const updateUser = () => {
  const index = state.users.findIndex(u => u.id === state.form.id)
  if (index === -1) return

  state.users[index].name = state.form.name
  state.users[index].email = state.form.email

  closeModal()
}

// SUBMIT HANDLER
const handleSubmit = () => {
  if (state.isEditing) {
    updateUser()
  } else {
    createUser()
  }
}

// DELETE
const deleteUser = (id) => {
  const index = state.users.findIndex(u => u.id === id)
  if (index === -1) return
  state.users.splice(index, 1)
}

const resetForm = () => {
  state.form.id = null
  state.form.name = ''
  state.form.email = ''
}
</script>

<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="h4">User CRUD (reactive + Bootstrap Modal)</h2>
      <button class="btn btn-primary" @click="openCreateModal">
        + Add User
      </button>
    </div>

    <p class="mb-3">Total users: <strong>{{ totalUsers }}</strong></p>

    <table class="table table-bordered table-striped align-middle">
      <thead class="table-light">
        <tr>
          <th style="width: 60px;">#</th>
          <th style="width: 30%;">Name</th>
          <th>Email</th>
          <th style="width: 180px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in state.users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button
              class="btn btn-sm btn-warning me-2"
              @click="openEditModal(user)"
            >
              Edit
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteUser(user.id)"
            >
              Delete
            </button>
          </td>
        </tr>

        <tr v-if="state.users.length === 0">
          <td colspan="4" class="text-center text-muted">
            No users yet. Click "Add User" to create one.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Bootstrap Modal -->
    <div
      class="modal fade"
      id="userModal"
      tabindex="-1"
      aria-labelledby="userModalLabel"
      aria-hidden="true"
      ref="modalEl"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="handleSubmit">
            <div class="modal-header">
              <h5 class="modal-title" id="userModalLabel">
                {{ state.isEditing ? 'Edit User' : 'Create User' }}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="closeModal"
              ></button>
            </div>

            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="state.form.name"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="state.form.email"
                  required
                />
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                @click="closeModal"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                {{ state.isEditing ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>