<template>
  <button
    @click="toggleTheme"
    class="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    <!-- 太阳图标 -->
    <svg v-if="isDark" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
    <!-- 月亮图标 -->
    <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const isDark = ref(false);

// 从 localStorage 加载主题设置
const loadTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "dark";
};

// 保存主题设置到 localStorage
const saveTheme = (isDark) => {
  localStorage.setItem("theme", isDark ? "dark" : "light");
};

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value;
  updateTheme();
};

// 更新主题
const updateTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  saveTheme(isDark.value);
};

// 初始化主题
onMounted(() => {
  isDark.value = loadTheme();
  updateTheme();
});
</script>
