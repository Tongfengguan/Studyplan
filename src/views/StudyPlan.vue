<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
  >
    <!-- 导航栏 -->
    <nav
      class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">通风管看看</h1>
          </div>
          <div class="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">学习计划</h1>
        <button
          @click="showTaskForm = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-base transition-colors duration-200"
        >
          添加任务
        </button>
      </div>

      <!-- 日历视图 -->
      <div class="mb-8">
        <CalendarView :tasks="tasks" />
      </div>

      <!-- 任务列表 -->
      <div
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">任务列表</h2>
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
                class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">全选</span>
            </div>
            <button
              v-if="selectedTasks.length > 0"
              @click="confirmBatchDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              删除选中 ({{ selectedTasks.length }})
            </button>
          </div>
        </div>
        <TaskList
          :tasks="tasks"
          @toggle-status="toggleTaskStatus"
          @delete-task="confirmDelete"
          @update-status="updateTaskStatus"
          @update-task="updateTask"
        />
      </div>
    </div>

    <!-- 任务表单弹窗 -->
    <div
      v-if="showTaskForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      @click="showTaskForm = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" @click.stop>
        <TaskForm @submit="addTask" />
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      @click="showDeleteConfirm = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" @click.stop>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">确认删除</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{
            isBatchDelete
              ? `确定要删除选中的 ${selectedTasks.length} 个任务吗？`
              : "确定要删除这个任务吗？"
          }}
          此操作无法撤销。
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            取消
          </button>
          <button
            @click="handleDeleteConfirm"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import TaskForm from "../components/TaskForm.vue";
import ThemeToggle from "../components/ThemeToggle.vue";
import CalendarView from "../components/CalendarView.vue";
import TaskList from "../components/TaskList.vue";

const showTaskForm = ref(false);
const showDeleteConfirm = ref(false);
const tasks = ref([]);
const taskToDelete = ref(null);
const isBatchDelete = ref(false);

// 选中的任务
const selectedTasks = ref([]);

// 是否全选
const isAllSelected = computed(() => {
  return tasks.value.length > 0 && selectedTasks.value.length === tasks.value.length;
});

// 切换全选
const toggleSelectAll = (event) => {
  if (event.target.checked) {
    selectedTasks.value = tasks.value.map((task) => task.id);
  } else {
    selectedTasks.value = [];
  }
};

// 添加任务
const addTask = (task) => {
  const newTask = {
    ...task,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: "not_started",
  };
  tasks.value.push(newTask);
  showTaskForm.value = false;
  saveTasks();
};

// 确认删除
const confirmDelete = (taskId) => {
  taskToDelete.value = taskId;
  isBatchDelete.value = false;
  showDeleteConfirm.value = true;
};

// 确认批量删除
const confirmBatchDelete = () => {
  isBatchDelete.value = true;
  showDeleteConfirm.value = true;
};

// 处理删除确认
const handleDeleteConfirm = () => {
  if (isBatchDelete.value) {
    // 批量删除选中的任务
    tasks.value = tasks.value.filter((task) => !selectedTasks.value.includes(task.id));
  } else if (taskToDelete.value) {
    // 删除单个任务
    tasks.value = tasks.value.filter((t) => t.id !== taskToDelete.value);
  }
  saveTasks();
  showDeleteConfirm.value = false;
  taskToDelete.value = null;
  isBatchDelete.value = false;
};

// 保存任务到 localStorage
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};

// 从 localStorage 加载任务
const loadTasks = () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks);
  }
};

// 在组件挂载时加载任务
onMounted(() => {
  loadTasks();
});

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// 获取优先级文本
const getPriorityText = (priority) => {
  const priorityMap = {
    high: "高",
    medium: "中",
    low: "低",
  };
  return priorityMap[priority] || priority;
};

// 排序任务
const sortedTasks = computed(() => {
  return [...tasks.value].sort((a, b) => {
    // 首先按截止日期排序
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB;
    }

    // 然后按优先级排序
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    // 最后按状态排序（未完成的在前）
    if (a.status !== b.status) {
      return a.status === "completed" ? 1 : -1;
    }

    // 如果都相同，按ID排序（保持稳定）
    return a.id.localeCompare(b.id);
  });
});

// 切换任务状态
const toggleTaskStatus = (taskId) => {
  const task = tasks.value.find((t) => t.id === taskId);
  if (task) {
    task.status = task.status === "completed" ? "not_started" : "completed";
    // 如果任务被标记为完成，从选中列表中移除
    if (task.status === "completed") {
      selectedTasks.value = selectedTasks.value.filter((id) => id !== taskId);
    }
    saveTasks();
  }
};

// 更新任务状态
const updateTaskStatus = (taskId, newStatus) => {
  const task = tasks.value.find((t) => t.id === taskId);
  if (task) {
    task.status = newStatus;
    saveTasks();
  }
};

// 更新任务
const updateTask = (taskId, updates) => {
  const taskIndex = tasks.value.findIndex((t) => t.id === taskId);
  if (taskIndex !== -1) {
    const updatedTask = {
      ...tasks.value[taskIndex],
      ...updates,
      id: taskId, // 确保ID保持不变
    };
    console.log("StudyPlan updateTask:", taskId, updates);
    console.log("StudyPlan tasks before update:", tasks.value);
    tasks.value[taskIndex] = updatedTask;
    console.log("StudyPlan tasks after update:", tasks.value);
    saveTasks();
  }
};
</script>

<style>
/* 添加背景图案 */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)),
    radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
}

/* 暗色模式下的背景图案 */
.dark .bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)),
    radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
}
</style>
