<template>
  <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-700 dark:text-gray-300">完成进度</span>
        <div class="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            class="h-2.5 rounded-full transition-all duration-300 ease-in-out"
            :class="{
              'bg-red-500 dark:bg-red-400': percentage < 30,
              'bg-yellow-500 dark:bg-yellow-400': percentage >= 30 && percentage < 70,
              'bg-green-500 dark:bg-green-400': percentage >= 70,
            }"
            :style="{ width: `${percentage}%` }"
          ></div>
        </div>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ percentage }}%</span>
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        已完成 {{ completedCount }}/{{ totalCount }} 个任务
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
});

// 计算完成百分比
const percentage = computed(() => {
  if (props.tasks.length === 0) return 0;
  const completedCount = props.tasks.filter((task) => task.completed).length;
  return Math.round((completedCount / props.tasks.length) * 100);
});

// 计算已完成任务数量
const completedCount = computed(() => {
  return props.tasks.filter((task) => task.completed).length;
});

// 计算总任务数量
const totalCount = computed(() => {
  return props.tasks.length;
});
</script>
