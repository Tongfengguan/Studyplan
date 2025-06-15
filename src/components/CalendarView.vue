<template>
  <div
    class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4"
  >
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">日历</h2>
      <div class="flex items-center space-x-4">
        <span class="text-lg font-medium text-gray-700 dark:text-gray-300">
          {{ currentYearMonth }}
        </span>
        <div class="flex space-x-2">
          <button
            @click="previousMonth"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            @click="nextMonth"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 星期标题 -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
        v-for="day in ['日', '一', '二', '三', '四', '五', '六']"
        :key="day"
        class="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
      >
        {{ day }}
      </div>
    </div>

    <!-- 日历网格 -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="min-h-[100px] p-2 rounded-lg"
        :class="[
          'relative p-2 h-24 overflow-hidden transition-colors duration-200',
          isToday(day)
            ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400'
            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
          isCurrentMonth(day) ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50',
        ]"
      >
        <div class="flex justify-between items-start">
          <span
            :class="[
              'text-sm',
              isToday(day)
                ? 'font-bold text-blue-600 dark:text-blue-300'
                : 'text-gray-500 dark:text-gray-400',
              !isCurrentMonth(day) && 'text-gray-400 dark:text-gray-500',
            ]"
          >
            {{ day.getDate() }}
          </span>
        </div>
        <div class="space-y-1">
          <div
            v-for="task in getTasksForDay(day)"
            :key="task.id"
            class="text-xs p-1 rounded truncate"
            :class="getTaskClass(task)"
            @click="selectTask(task)"
          >
            {{ task.title }}
          </div>
        </div>
      </div>
    </div>

    <!-- 任务详情弹窗 -->
    <div
      v-if="selectedTask"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      @click="selectedTask = null"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" @click.stop>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ selectedTask.title }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          {{ selectedTask.description }}
        </p>
        <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <div>截止日期：{{ formatDate(selectedTask.dueDate) }}</div>
          <div>优先级：{{ getPriorityText(selectedTask.priority) }}</div>
        </div>
        <div class="mt-4 flex justify-end space-x-2">
          <button
            @click="selectedTask = null"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
});

const currentDate = ref(new Date());
const selectedTask = ref(null);

// 获取当前年月显示
const currentYearMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth() + 1;
  return `${year}年${month}月`;
});

// 获取当前月份的所有日期
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];
  const firstDayOfWeek = firstDay.getDay();

  // 添加上个月的最后几天
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  // 添加当前月的天数
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // 添加下个月的前几天
  const remainingDays = 42 - days.length; // 6行7列
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
});

// 判断是否是今天
const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// 判断是否是当前月份
const isCurrentMonth = (date) => {
  return date.getMonth() === currentDate.value.getMonth();
};

// 获取某天的任务
const getTasksForDay = (date) => {
  return props.tasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    return (
      taskDate.getDate() === date.getDate() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getFullYear() === date.getFullYear()
    );
  });
};

// 获取任务样式
const getTaskClass = (task) => {
  const baseClass = "cursor-pointer";
  const priorityClass = {
    high: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
    medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200",
    low: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
  };
  const statusClass = task.status === "completed" ? "opacity-50" : "";

  return `${baseClass} ${priorityClass[task.priority]} ${statusClass}`;
};

// 切换月份
const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

// 选择任务
const selectTask = (task) => {
  selectedTask.value = task;
};

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
</script>

<style>
.flatpickr-calendar {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  font-family: inherit;
}

.dark .flatpickr-calendar {
  background-color: #1f2937;
  border-color: #374151;
}

.flatpickr-day {
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.dark .flatpickr-day {
  color: #d1d5db;
}

.flatpickr-day.selected {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
  font-weight: 600;
}

.flatpickr-day.today {
  border-color: #3b82f6;
  font-weight: 600;
}

.flatpickr-months .flatpickr-month {
  background-color: white;
  color: #111827;
  font-weight: 500;
  font-size: 0.875rem;
}

.dark .flatpickr-months .flatpickr-month {
  background-color: #1f2937;
  color: white;
}

.flatpickr-current-month .flatpickr-monthDropdown-months {
  background-color: white;
  color: #111827;
  font-weight: 500;
  font-size: 0.875rem;
}

.dark .flatpickr-current-month .flatpickr-monthDropdown-months {
  background-color: #1f2937;
  color: white;
}

.flatpickr-weekday {
  color: #6b7280;
  font-weight: 500;
  font-size: 0.875rem;
}

.dark .flatpickr-weekday {
  color: #9ca3af;
}

.flatpickr-day.disabled {
  color: #9ca3af;
}

.dark .flatpickr-day.disabled {
  color: #4b5563;
}

.flatpickr-input {
  font-family: inherit;
  font-size: 0.875rem;
}

.flatpickr-monthDropdown-months {
  font-family: inherit;
  font-size: 0.875rem;
}

.flatpickr-current-month .flatpickr-monthDropdown-months {
  font-family: inherit;
  font-size: 0.875rem;
}

.flatpickr-current-month input.cur-year {
  font-family: inherit;
  font-size: 0.875rem;
}
</style>
