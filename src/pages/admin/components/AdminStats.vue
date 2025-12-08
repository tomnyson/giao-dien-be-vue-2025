<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TimeScale,
  LineElement,
  PointElement,
  LineController,
  Filler
} from 'chart.js'

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TimeScale,
  LineElement,
  PointElement,
  LineController,
  Filler
)

const props = defineProps({
  orders: {
    type: Array,
    default: () => []
  },
  formatPrice: {
    type: Function,
    required: true
  }
})

const chartType = ref('bar')
const chartView = ref('all')
const selectedDate = ref(new Date().toISOString().slice(0, 10))
const startDate = ref('')
const endDate = ref('')

const monthChartRef = ref(null)
const weekChartRef = ref(null)
const yearChartRef = ref(null)
const dayChartRef = ref(null)
const weekDayChartRef = ref(null)
const hourChartRef = ref(null)
const monthChart = ref(null)
const weekChart = ref(null)
const yearChart = ref(null)
const dayChart = ref(null)
const weekDayChart = ref(null)
const hourChart = ref(null)
const uploadedImages = ref([])

const parseDate = (dateStr) => {
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

const statusSummary = computed(() => {
  const summary = {
    pending: { count: 0, total: 0 },
    processing: { count: 0, total: 0 },
    completed: { count: 0, total: 0 },
    cancelled: { count: 0, total: 0 }
  }
  filteredOrders.value.forEach(o => {
    const status = o.status || 'pending'
    if (!summary[status]) summary[status] = { count: 0, total: 0 }
    summary[status].count += 1
    summary[status].total += Number(o.total || 0)
  })
  return summary
})

const filteredOrders = computed(() => {
  if (!startDate.value && !endDate.value) return props.orders
  return props.orders.filter(o => {
    const d = parseDate(o.created)
    if (!d) return false
    if (startDate.value) {
      const s = new Date(startDate.value)
      if (d < s) return false
    }
    if (endDate.value) {
      const e = new Date(endDate.value)
      e.setHours(23, 59, 59, 999)
      if (d > e) return false
    }
    return true
  })
})

const revenueMonthSeries = computed(() => {
  const acc = {}
  filteredOrders.value.forEach(o => {
    const d = parseDate(o.created)
    if (!d) return
    const label = `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
    acc[label] = (acc[label] || 0) + Number(o.total || 0)
  })
  return Object.entries(acc).sort(([a], [b]) => new Date(`01/${a}`) - new Date(`01/${b}`))
})

const revenueWeekSeries = computed(() => {
  const acc = {}
  const getWeek = (d) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    const dayNum = date.getUTCDay() || 7
    date.setUTCDate(date.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
  }
  filteredOrders.value.forEach(o => {
    const d = parseDate(o.created)
    if (!d) return
    const week = getWeek(d)
    const label = `W${week}-${d.getFullYear()}`
    acc[label] = (acc[label] || 0) + Number(o.total || 0)
  })
  return Object.entries(acc).sort(([a], [b]) => {
    const [wa, ya] = a.replace('W', '').split('-').map(Number)
    const [wb, yb] = b.replace('W', '').split('-').map(Number)
    if (ya === yb) return wa - wb
    return ya - yb
  })
})

const revenueYearSeries = computed(() => {
  const acc = {}
  filteredOrders.value.forEach(o => {
    const d = parseDate(o.created)
    if (!d) return
    const y = d.getFullYear()
    acc[y] = (acc[y] || 0) + Number(o.total || 0)
  })
  return Object.entries(acc).sort(([a], [b]) => Number(a) - Number(b))
})

const dailyRevenue = computed(() => {
  if (!selectedDate.value) return 0
  return filteredOrders.value.reduce((sum, o) => {
    const d = parseDate(o.created)
    if (!d) return sum
    if (d.toISOString().slice(0, 10) === selectedDate.value) {
      return sum + Number(o.total || 0)
    }
    return sum
  }, 0)
})

const totalRangeRevenue = computed(() =>
  filteredOrders.value.reduce((sum, o) => sum + Number(o.total || 0), 0)
)

const selectedMonthYear = computed(() => {
  const d = parseDate(selectedDate.value)
  if (!d) return null
  return { month: d.getMonth(), year: d.getFullYear() }
})

const dailyInMonthSeries = computed(() => {
  if (!selectedMonthYear.value) return []
  const { month, year } = selectedMonthYear.value
  const days = new Date(year, month + 1, 0).getDate()
  const arr = Array.from({ length: days }, () => 0)
  filteredOrders.value.forEach(o => {
    const d = parseDate(o.created)
    if (!d) return
    if (d.getMonth() === month && d.getFullYear() === year) {
      arr[d.getDate() - 1] += Number(o.total || 0)
    }
  })
  return arr.map((val, idx) => [`${idx + 1}/${month + 1}`, val])
})

const weekDaySeries = computed(() => {
  const labels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  const arr = Array(7).fill(0)
  filteredOrders.value.forEach(o => {
    const d = parseDate(o.created)
    if (!d) return
    const dow = d.getDay()
    arr[dow] += Number(o.total || 0)
  })
  return arr.map((val, idx) => [labels[idx], val])
})

const hourSeries = computed(() => {
  if (!selectedDate.value) return []
  const hours = Array(24).fill(0)
  filteredOrders.value.forEach(o => {
    const d = parseDate(o.created)
    if (!d) return
    if (d.toISOString().slice(0, 10) === selectedDate.value) {
      hours[d.getHours()] += Number(o.total || 0)
    }
  })
  return hours.map((val, idx) => [`${idx}:00`, val])
})

const chartTypeLabel = computed(() => (chartType.value === 'line' ? 'Line' : 'Bar'))

const renderLineChart = (ctx, labels, data, color = '#0d6efd') => {
  if (!ctx) return null
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Doanh thu',
          data,
          borderColor: color,
          backgroundColor: `${color}33`,
          fill: true,
          tension: 0.25,
          pointRadius: 3,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (context) => props.formatPrice(context.raw) } },
      },
      scales: {
        y: { ticks: { callback: (value) => props.formatPrice(value) } },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  })
}

const renderBarChart = (ctx, labels, data, color = '#0d6efd') => {
  if (!ctx) return null
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Doanh thu',
          data,
          backgroundColor: color,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (context) => props.formatPrice(context.raw) } },
      },
      scales: {
        y: { ticks: { callback: (value) => props.formatPrice(value) } },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  })
}

const updateCharts = () => {
  const lineOrBar = (ctx, labels, data, color) =>
    chartType.value === 'line'
      ? renderLineChart(ctx, labels, data, color)
      : renderBarChart(ctx, labels, data, color)

  if (monthChart.value) monthChart.value.destroy()
  if (monthChartRef.value) {
    monthChart.value = lineOrBar(
      monthChartRef.value.getContext('2d'),
      revenueMonthSeries.value.map(([label]) => label),
      revenueMonthSeries.value.map(([, val]) => val),
      '#0d6efd'
    )
  }

  if (dayChart.value) dayChart.value.destroy()
  if (dayChartRef.value) {
    dayChart.value = lineOrBar(
      dayChartRef.value.getContext('2d'),
      dailyInMonthSeries.value.map(([label]) => label),
      dailyInMonthSeries.value.map(([, val]) => val),
      '#4f46e5'
    )
  }

  if (weekChart.value) weekChart.value.destroy()
  if (weekChartRef.value) {
    weekChart.value = lineOrBar(
      weekChartRef.value.getContext('2d'),
      revenueWeekSeries.value.map(([w]) => w),
      revenueWeekSeries.value.map(([, val]) => val),
      '#198754'
    )
  }

  if (weekDayChart.value) weekDayChart.value.destroy()
  if (weekDayChartRef.value) {
    weekDayChart.value = lineOrBar(
      weekDayChartRef.value.getContext('2d'),
      weekDaySeries.value.map(([label]) => label),
      weekDaySeries.value.map(([, val]) => val),
      '#0ea5e9'
    )
  }

  if (hourChart.value) hourChart.value.destroy()
  if (hourChartRef.value) {
    hourChart.value = lineOrBar(
      hourChartRef.value.getContext('2d'),
      hourSeries.value.map(([label]) => label),
      hourSeries.value.map(([, val]) => val),
      '#f97316'
    )
  }

  if (yearChart.value) yearChart.value.destroy()
  if (yearChartRef.value) {
    yearChart.value = lineOrBar(
      yearChartRef.value.getContext('2d'),
      revenueYearSeries.value.map(([y]) => y),
      revenueYearSeries.value.map(([, val]) => val),
      '#f59e0b'
    )
  }
}

const refreshCharts = () => nextTick(() => updateCharts())

const handleFileChange = (event) => {
  const files = Array.from(event.target.files || [])
  files.forEach(file => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    uploadedImages.value.push({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url
    })
  })
  // reset input to allow re-selecting the same file
  event.target.value = ''
}

const removeImage = (id) => {
  const target = uploadedImages.value.find(img => img.id === id)
  if (target) URL.revokeObjectURL(target.url)
  uploadedImages.value = uploadedImages.value.filter(img => img.id !== id)
}

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

onMounted(() => {
  refreshCharts()
})

onBeforeUnmount(() => {
  ;[monthChart, weekChart, yearChart, dayChart, weekDayChart, hourChart].forEach(chartRef => {
    if (chartRef.value) chartRef.value.destroy()
  })
  uploadedImages.value.forEach(img => URL.revokeObjectURL(img.url))
})

watch(
  () => props.orders,
  () => refreshCharts(),
  { deep: true }
)

watch([startDate, endDate, selectedDate, chartType, chartView], () => refreshCharts())
</script>

<template>
  <div class="card shadow-sm tab-pane fade show active">
    <div class="card-body">
      <div class="d-flex justify-content-end gap-2 flex-wrap mb-3">
        <div class="btn-group btn-group-sm" role="group">
          <button
            type="button"
            class="btn"
            :class="chartType === 'line' ? 'btn-primary' : 'btn-outline-primary'"
            @click="chartType = 'line'; refreshCharts()"
          >
            Line
          </button>
          <button
            type="button"
            class="btn"
            :class="chartType === 'bar' ? 'btn-primary' : 'btn-outline-primary'"
            @click="chartType = 'bar'; refreshCharts()"
          >
            Bar
          </button>
        </div>

        <div class="btn-group btn-group-sm" role="group">
          <button
            v-for="option in ['all','day','weekday','hour','month','week','year']"
            :key="option"
            type="button"
            class="btn"
            :class="chartView === option ? 'btn-primary' : 'btn-outline-primary'"
            @click="chartView = option; refreshCharts()"
          >
            {{ option === 'all' ? 'All' : option }}
          </button>
        </div>
      </div>
      <div class="row g-3 mb-3 align-items-end">
        <div class="col-md-3" v-for="(stat, key) in statusSummary" :key="key">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <p class="text-muted text-uppercase small mb-1">{{ key }}</p>
              <h4 class="mb-1">{{ formatPrice(stat.total) }}</h4>
              <p class="text-secondary mb-0 small">{{ stat.count }} đơn</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <p class="text-muted small mb-1">Khoảng thời gian</p>
              <div class="d-flex gap-2 mb-2">
                <input type="date" class="form-control form-control-sm" v-model="startDate" />
                <input type="date" class="form-control form-control-sm" v-model="endDate" />
              </div>
              <p class="small text-muted mb-1">Tổng doanh thu</p>
              <h5 class="mb-0 text-primary">{{ formatPrice(totalRangeRevenue) }}</h5>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <p class="text-muted small mb-1">Doanh thu ngày</p>
              <input type="date" class="form-control form-control-sm mb-2" v-model="selectedDate" />
              <h5 class="mb-0 text-primary">{{ formatPrice(dailyRevenue) }}</h5>
              <p class="small text-secondary mb-0" v-if="startDate || endDate">
                Chỉ tính trong khoảng đã chọn
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
        <div class="col" v-if="chartView === 'all' || chartView === 'day'">
          <div class="card shadow-sm h-100 chart-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Theo ngày trong tháng</h6>
                <small class="text-muted">{{ chartTypeLabel }}</small>
              </div>
              <div class="chart-box">
                <canvas ref="dayChartRef"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="col" v-if="chartView === 'all' || chartView === 'weekday'">
          <div class="card shadow-sm h-100 chart-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Theo thứ trong tuần</h6>
                <small class="text-muted">{{ chartTypeLabel }}</small>
              </div>
              <div class="chart-box">
                <canvas ref="weekDayChartRef"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="col" v-if="chartView === 'all' || chartView === 'hour'">
          <div class="card shadow-sm h-100 chart-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Theo giờ trong ngày</h6>
                <small class="text-muted">{{ chartTypeLabel }}</small>
              </div>
              <div class="chart-box">
                <canvas ref="hourChartRef"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="col" v-if="chartView === 'all' || chartView === 'month'">
          <div class="card shadow-sm h-100 chart-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Theo tháng (năm hiện tại)</h6>
                <small class="text-muted">{{ chartTypeLabel }}</small>
              </div>
              <div class="chart-box">
                <canvas ref="monthChartRef"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="col" v-if="chartView === 'all' || chartView === 'week'">
          <div class="card shadow-sm h-100 chart-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Theo tuần (năm hiện tại)</h6>
                <small class="text-muted">{{ chartTypeLabel }}</small>
              </div>
              <div class="chart-box">
                <canvas ref="weekChartRef"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="col" v-if="chartView === 'all' || chartView === 'year'">
          <div class="card shadow-sm h-100 chart-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Theo năm</h6>
                <small class="text-muted">{{ chartTypeLabel }}</small>
              </div>
              <div class="chart-box">
                <canvas ref="yearChartRef"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div>
                <h6 class="mb-0">Upload hình ảnh</h6>
                <small class="text-muted">Chọn 1 hoặc nhiều ảnh để lưu trữ/đính kèm</small>
              </div>
              <label class="btn btn-sm btn-primary mb-0">
                Chọn file
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  class="d-none"
                  @change="handleFileChange"
                />
              </label>
            </div>

            <div v-if="uploadedImages.length" class="image-grid">
              <div v-for="img in uploadedImages" :key="img.id" class="image-card">
                <div class="thumb">
                  <img :src="img.url" :alt="img.name" />
                </div>
                <div class="image-meta">
                  <span class="fw-semibold text-truncate" :title="img.name">{{ img.name }}</span>
                  <small class="text-muted">{{ formatSize(img.size) }}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger w-100" @click="removeImage(img.id)">Xóa</button>
              </div>
            </div>
            <div v-else class="text-secondary small">Chưa có ảnh nào được chọn.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-card {
  min-height: 320px;
}

.chart-box {
  height: 240px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.image-card {
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 10px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.thumb img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #f1f3f5;
}

.image-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
</style>
