<script setup>
import { reactive } from 'vue'

const props = defineProps({
  users: {
    type: Array,
    default: () => []
  },
  onSaveUser: {
    type: Function,
    required: true
  },
  onDeleteUser: {
    type: Function,
    required: true
  }
})

const userForm = reactive({ id: '', username: '', password: '', role: 'user' })

const resetUserForm = () => Object.assign(userForm, { id: '', username: '', password: '', role: 'user' })

const handleSubmit = async () => {
  const saved = await props.onSaveUser({ ...userForm })
  if (saved) resetUserForm()
}

const editUser = (u) => {
  Object.assign(userForm, u)
}

const deleteUser = async (id) => {
  await props.onDeleteUser(id)
}
</script>

<template>
  <div class="card shadow-sm tab-pane fade show active">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 mb-0">Người dùng</h2>
        <button class="btn btn-sm btn-outline-secondary" @click="resetUserForm">Làm mới</button>
      </div>

      <form class="row g-2 mb-3" @submit.prevent="handleSubmit">
        <div class="col-md-4">
          <input v-model="userForm.username" type="email" class="form-control" placeholder="Email" required />
        </div>
        <div class="col-md-4">
          <input v-model="userForm.password" type="text" class="form-control" placeholder="Mật khẩu" required />
        </div>
        <div class="col-md-4">
          <select v-model="userForm.role" class="form-select">
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <div class="col-12 text-end">
          <button type="submit" class="btn btn-primary btn-sm">Lưu người dùng</button>
        </div>
      </form>

      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.id">
              <td>{{ u.id }}</td>
              <td>{{ u.username }}</td>
              <td><span class="badge text-bg-secondary text-capitalize">{{ u.role }}</span></td>
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-secondary" @click="editUser(u)">Sửa</button>
                  <button class="btn btn-outline-danger" @click="deleteUser(u.id)">Xóa</button>
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
