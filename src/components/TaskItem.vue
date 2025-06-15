<template>
  <div
    class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
  >
    <div class="flex items-start justify-between">
      <div class="flex items-start space-x-3 min-w-0 flex-1">
        <input
          type="checkbox"
          :checked="task.completed"
          @change="$emit('toggle-status', task.id)"
          class="h-4 w-4 mt-1 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 transition-colors duration-150"
        />
        <div class="min-w-0 flex-1">
          <div class="flex items-center space-x-2">
            <h3
              :class="[
                'text-sm font-medium truncate',
                task.completed
                  ? 'text-gray-400 dark:text-gray-500 line-through'
                  : 'text-gray-900 dark:text-white',
              ]"
            >
              {{ task.title }}
            </h3>
            <span
              :class="[
                'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                {
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200':
                    task.priority === 'high',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                    task.priority === 'medium',
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                    task.priority === 'low',
                },
              ]"
            >
              {{
                task.priority === "high"
                  ? "高优先级"
                  : task.priority === "medium"
                  ? "中优先级"
                  : "低优先级"
              }}
            </span>
          </div>
          <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ task.description }}</p>
          <div class="mt-2 flex items-center space-x-4 text-xs text-gray-500">
            <div class="flex items-center space-x-1">
              <svg
                class="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span
                :class="[
                  'text-gray-500 dark:text-gray-400',
                  {
                    'text-red-600 dark:text-red-400 font-medium': isOverdue,
                    'text-yellow-600 dark:text-yellow-400 font-medium': isDueSoon,
                  },
                ]"
              >
                {{ formatDate(task.dueDate) }}
                <span v-if="isOverdue" class="ml-1">(已过期)</span>
                <span v-else-if="isDueSoon" class="ml-1">(即将到期)</span>
              </span>
            </div>
            <div class="flex items-center space-x-1">
              <svg
                class="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ task.createdAt }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-3 ml-4">
        <select
          v-model="localStatus"
          @change="updateStatus"
          class="block w-32 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          :disabled="task.completed"
          :class="{ 'opacity-50 cursor-not-allowed': task.completed }"
        >
          <option value="not_started">未开始</option>
          <option value="in_progress">进行中</option>
          <option value="completed">已完成</option>
        </select>
        <button
          @click="$emit('delete-task', task.id)"
          class="text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["toggle-status", "delete-task", "update-status"]);

const localStatus = ref(props.task.status);

onMounted(() => {
  localStatus.value = props.task.status;
});

const updateStatus = () => {
  emit("update-status", props.task.id, localStatus.value);
};

const priorityText = computed(() => {
  const priorityMap = {
    high: "高优先级",
    medium: "中优先级",
    low: "低优先级",
  };
  return priorityMap[props.task.priority];
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const isOverdue = computed(() => {
  if (props.task.completed) return false;
  const dueDate = new Date(props.task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
});

const isDueSoon = computed(() => {
  if (props.task.completed || isOverdue.value) return false;
  const dueDate = new Date(props.task.dueDate);
  const today = new Date();
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);
  today.setHours(0, 0, 0, 0);
  return dueDate >= today && dueDate <= threeDaysLater;
});
</script>
