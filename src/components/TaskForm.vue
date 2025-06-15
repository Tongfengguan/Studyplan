<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
        任务标题
      </label>
      <input
        v-model="form.title"
        type="text"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
        placeholder="请输入任务标题"
      />
    </div>

    <div>
      <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
        任务描述
      </label>
      <textarea
        v-model="form.description"
        rows="3"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
        placeholder="请输入任务描述"
      ></textarea>
    </div>

    <div>
      <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
        任务时间
      </label>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <input
              ref="datePicker"
              type="text"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              placeholder="选择日期范围"
            />
          </div>
          <div class="flex items-center">
            <input
              type="checkbox"
              v-model="isRange"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label class="ml-2 text-sm text-gray-700 dark:text-gray-300">连续多天</label>
          </div>
        </div>

        <div v-if="isRange" class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            选择重复的星期
          </label>
          <div class="grid grid-cols-7 gap-2">
            <label v-for="(day, index) in weekDays" :key="index" class="flex flex-col items-center">
              <input
                type="checkbox"
                v-model="selectedWeekDays"
                :value="index"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ day }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div>
      <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
        优先级
      </label>
      <div class="flex space-x-6">
        <label class="flex items-center">
          <input
            type="radio"
            v-model="form.priority"
            value="high"
            class="w-5 h-5 text-red-600 border-gray-300 focus:ring-red-500"
          />
          <span class="ml-2 text-base text-gray-700 dark:text-gray-300">高</span>
        </label>
        <label class="flex items-center">
          <input
            type="radio"
            v-model="form.priority"
            value="medium"
            class="w-5 h-5 text-yellow-600 border-gray-300 focus:ring-yellow-500"
          />
          <span class="ml-2 text-base text-gray-700 dark:text-gray-300">中</span>
        </label>
        <label class="flex items-center">
          <input
            type="radio"
            v-model="form.priority"
            value="low"
            class="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
          />
          <span class="ml-2 text-base text-gray-700 dark:text-gray-300">低</span>
        </label>
      </div>
    </div>

    <button
      type="submit"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-base transition-colors duration-200"
    >
      添加任务
    </button>
  </form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { zh } from "flatpickr/dist/l10n/zh.js";

const emit = defineEmits(["submit"]);

const form = ref({
  title: "",
  description: "",
  dueDate: "",
  priority: "medium",
});

const datePicker = ref(null);
const isRange = ref(false);
const selectedWeekDays = ref([]);
const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
let fp = null;

onMounted(() => {
  fp = flatpickr(datePicker.value, {
    dateFormat: "Y/m/d",
    minDate: new Date().toISOString().split("T")[0],
    locale: zh,
    mode: "range",
    allowInput: true,
    enableTime: false,
    onChange: (selectedDates) => {
      if (selectedDates.length > 0) {
        if (isRange.value) {
          form.value.dueDate = selectedDates.map((date) => date.toISOString().split("T")[0]);
        } else {
          form.value.dueDate = selectedDates[0].toISOString().split("T")[0];
        }
      }
    },
  });
});

watch(isRange, (newValue) => {
  if (fp) {
    fp.set("mode", newValue ? "range" : "single");
    fp.clear();
    form.value.dueDate = "";
    if (!newValue) {
      selectedWeekDays.value = [];
    }
  }
});

const handleSubmit = () => {
  if (!form.value.title || !form.value.dueDate) {
    alert("请填写任务标题和截止日期");
    return;
  }

  if (isRange.value && Array.isArray(form.value.dueDate)) {
    // 批量添加任务
    const [startDate, endDate] = form.value.dueDate;
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const taskDate = new Date(date);
      // 如果选择了特定的星期几，只在这些日期创建任务
      if (
        selectedWeekDays.value.length === 0 ||
        selectedWeekDays.value.includes(taskDate.getDay())
      ) {
        emit("submit", {
          ...form.value,
          dueDate: taskDate.toISOString().split("T")[0],
        });
      }
    }
  } else {
    // 单个任务
    emit("submit", { ...form.value });
  }

  // 重置表单
  form.value = {
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  };
  if (fp) {
    fp.clear();
  }
  selectedWeekDays.value = [];
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
