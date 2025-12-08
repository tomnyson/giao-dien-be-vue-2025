<script setup>
defineProps({
  type: {
    type: String,
    default: 'card', // card, text, avatar, list
    validator: (value) => ['card', 'text', 'avatar', 'list', 'table'].includes(value)
  },
  count: {
    type: Number,
    default: 1
  }
})
</script>

<template>
  <div class="skeleton-loader">
    <!-- Card Skeleton -->
    <div v-if="type === 'card'" class="skeleton-card" v-for="i in count" :key="i">
      <div class="skeleton skeleton-image"></div>
      <div class="skeleton-card-body">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text" style="width: 80%"></div>
        <div class="skeleton skeleton-text" style="width: 60%"></div>
        <div class="skeleton-footer">
          <div class="skeleton skeleton-button" style="width: 80px"></div>
          <div class="skeleton skeleton-button" style="width: 100px"></div>
        </div>
      </div>
    </div>

    <!-- Text Skeleton -->
    <div v-if="type === 'text'" v-for="i in count" :key="i">
      <div class="skeleton skeleton-text mb-2"></div>
    </div>

    <!-- Avatar Skeleton -->
    <div v-if="type === 'avatar'" class="d-flex align-items-center gap-3">
      <div class="skeleton skeleton-avatar"></div>
      <div class="flex-grow-1">
        <div class="skeleton skeleton-text" style="width: 150px"></div>
        <div class="skeleton skeleton-text" style="width: 100px"></div>
      </div>
    </div>

    <!-- List Skeleton -->
    <div v-if="type === 'list'" v-for="i in count" :key="i" class="skeleton-list-item">
      <div class="skeleton skeleton-avatar"></div>
      <div class="flex-grow-1">
        <div class="skeleton skeleton-text mb-2"></div>
        <div class="skeleton skeleton-text" style="width: 70%"></div>
      </div>
    </div>

    <!-- Table Skeleton -->
    <div v-if="type === 'table'" class="skeleton-table">
      <div v-for="i in count" :key="i" class="skeleton-table-row">
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-loader {
  animation: fadeIn 0.3s ease-out;
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Card Skeleton */
.skeleton-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-bottom: 1rem;
}

.skeleton-image {
  width: 100%;
  height: 220px;
}

.skeleton-card-body {
  padding: 1rem;
}

.skeleton-title {
  height: 24px;
  margin-bottom: 12px;
  width: 70%;
}

.skeleton-text {
  height: 12px;
  margin-bottom: 8px;
}

.skeleton-footer {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.skeleton-button {
  height: 36px;
  border-radius: 6px;
}

/* Avatar Skeleton */
.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* List Item Skeleton */
.skeleton-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
}

/* Table Skeleton */
.skeleton-table {
  background: white;
  border-radius: 8px;
  padding: 1rem;
}

.skeleton-table-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.skeleton-table-row .skeleton {
  height: 20px;
}
</style>
