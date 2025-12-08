<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({
  orders: {
    type: Array,
    default: () => []
  },
  productsMap: {
    type: Object,
    default: () => ({})
  },
  formatPrice: {
    type: Function,
    required: true
  },
  onUpdateStatus: {
    type: Function,
    required: true
  },
  onDeleteOrder: {
    type: Function,
    required: true
  }
})

const expandedOrders = ref(new Set())
const orderEdit = reactive({ id: '', status: '' })

const toggleOrder = (id) => {
  const set = new Set(expandedOrders.value)
  if (set.has(id)) set.delete(id)
  else set.add(id)
  expandedOrders.value = set
}

const startEditOrder = (order) => {
  orderEdit.id = order.id
  orderEdit.status = order.status
}

const resetOrderEdit = () => Object.assign(orderEdit, { id: '', status: '' })

const saveOrderStatus = async () => {
  if (!orderEdit.id) return
  const updated = await props.onUpdateStatus(orderEdit.id, orderEdit.status)
  if (updated) resetOrderEdit()
}

const deleteOrder = async (id) => {
  await props.onDeleteOrder(id)
}
</script>

<template>
  <div class="card shadow-sm tab-pane fade show active">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 mb-0">Đơn hàng</h2>
        <button class="btn btn-sm btn-outline-secondary" @click="resetOrderEdit">Bỏ chọn</button>
      </div>

      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead>
          <tr>
            <th>ID</th>
            <th>Khách</th>
            <th>Ngày</th>
            <th>Thanh toán</th>
            <th>Trạng thái</th>
            <th>Tổng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="o in orders" :key="o.id">
            <tr>
              <td>{{ o.id }}</td>
              <td>{{ o.name }}</td>
              <td>{{ new Date(o.created).toLocaleString() }}</td>
              <td>{{ o.payment }}</td>
              <td>
                <span class="badge text-bg-secondary text-capitalize">{{ o.status }}</span>
              </td>
              <td>{{ formatPrice(o.total) }}</td>
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-secondary" @click="startEditOrder(o)">Sửa</button>
                  <button class="btn btn-outline-info" @click="toggleOrder(o.id)">Chi tiết</button>
                  <button class="btn btn-outline-danger" @click="deleteOrder(o.id)">Xóa</button>
                </div>
              </td>
            </tr>
            <tr v-if="expandedOrders.has(o.id)">
              <td colspan="7" class="bg-light">
                <div class="fw-semibold mb-2">Chi tiết đơn</div>
                <div v-if="o.orderItems?.length" class="d-grid gap-2">
                  <div
                    v-for="item in o.orderItems"
                    :key="item.id || item.productId"
                    class="d-flex align-items-center gap-3"
                  >
                    <div class="flex-grow-1">
                      <div class="fw-semibold">{{ productsMap[item.productId]?.name || item.productId }}</div>
                      <div class="text-muted small">SL: {{ item.quantity }} · {{ formatPrice(item.price) }}</div>
                    </div>
                    <div class="fw-bold text-primary">{{ formatPrice(item.lineTotal || item.quantity * item.price) }}</div>
                  </div>
                </div>
                <div v-else class="text-secondary small">Không có chi tiết đơn hàng.</div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

      <form class="row g-2 mt-3" @submit.prevent="saveOrderStatus">
        <div class="col-md-4">
          <input v-model="orderEdit.id" type="text" class="form-control" placeholder="Order ID" readonly />
        </div>
        <div class="col-md-4">
          <select v-model="orderEdit.status" class="form-select">
            <option value="pending">pending</option>
            <option value="processing">processing</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>
        <div class="col-md-4 text-end">
          <button type="submit" class="btn btn-primary btn-sm" :disabled="!orderEdit.id">Cập nhật trạng thái</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
table th, table td {
  vertical-align: middle;
}
</style>
