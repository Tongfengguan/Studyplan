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
        @update-task="$emit('update-task', $event[0], $event[1])"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import TaskItem from "./TaskItem.vue";

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["toggle-status", "delete-task", "update-status", "update-task"]);

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
        return task.status === "not_started";
      case "in_progress":
        return task.status === "in_progress";
      case "completed":
        return task.status === "completed";
      default:
        return true;
    }
  });
});

// 更新任务状态
const updateTaskStatus = (taskId, newStatus) => {
  emit("update-status", taskId, newStatus);
};

const editingTask = ref(null);
const editInput = ref(null);

const startEditing = (task) => {
  editingTask.value = { ...task };
  nextTick(() => {
    editInput.value?.focus();
  });
};

const saveEdit = () => {
  if (editingTask.value) {
    const index = props.tasks.findIndex((t) => t.id === editingTask.value.id);
    if (index !== -1) {
      const updatedTasks = [...props.tasks];
      updatedTasks[index] = { ...editingTask.value };
      emit("update-status", editingTask.value.id, updatedTasks[index].status);
    }
    editingTask.value = null;
  }
};

const cancelEdit = () => {
  editingTask.value = null;
};
</script>

<style scoped>
.edit-form {
  flex: 1;
  margin-left: 8px;
}

.edit-input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.edit-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}
</style>
