<template>
  <div>
    <!-- 筛选器 -->
    <div
      class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-700 dark:text-gray-300">状态筛选：</span>
          <select
            v-model="selectedStatus"
            class="block w-40 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">全部任务</option>
            <option value="not_started">未开始</option>
            <option value="in_progress">进行中</option>
            <option value="completed">已完成</option>
          </select>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          共 {{ filteredTasks.length }} 个任务
        </div>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="divide-y divide-gray-100 dark:divide-gray-700">
      <div v-if="filteredTasks.length === 0" class="p-8 text-center">
        <svg
          class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">暂无任务</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">开始添加你的第一个学习任务吧！</p>
      </div>
      <TaskItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @toggle-status="$emit('toggle-status', task.id)"
        @delete-task="$emit('delete-task', task.id)"
        @update-status="updateTaskStatus"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import TaskItem from "./TaskItem.vue";

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["toggle-status", "delete-task", "update-status"]);

// 状态筛选
const selectedStatus = ref("all");

// 根据状态筛选任务
const filteredTasks = computed(() => {
  if (selectedStatus.value === "all") {
    return props.tasks;
  }

  return props.tasks.filter((task) => {
    switch (selectedStatus.value) {
      case "not_started":
        return !task.completed && task.status === "not_started";
      case "in_progress":
        return !task.completed && task.status === "in_progress";
      case "completed":
        return task.completed;
      default:
        return true;
    }
  });
});

// 更新任务状态
const updateTaskStatus = (taskId, newStatus) => {
  emit("update-status", taskId, newStatus);
};
</script>
