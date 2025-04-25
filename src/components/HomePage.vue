<script setup>
import { ref, computed } from "vue";
import "tailwindcss";
import { useStore } from "./assets/stores/currentBudgetData";
import { changeHSL } from "@/utils/chartData";
import { postExpense, modifyBudgets } from "@/api/requests";

const budgetStore = useStore();

const getInitialData = () => ({
  costOfExpense: "",
  newCategory: "",
  existingCategory: undefined,
  newTotalBudget: "",
  budgetForm: false,
  expenseForm: false,
  date: "",
  description: "",
  categoryColor: "",
});

const categories = computed(() => budgetStore.categories);
const colours = computed(() =>
  budgetStore.getCategories.map((cat) => {
    return cat.hex_code;
  })
);

const formData = ref(getInitialData());
const optimisticMessage = ref("");
const dropdownOpen = ref(false);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const selectCategory = (index, item, color) => {
  formData.value.existingCategory = {
    key: budgetStore.categories[index]._id,
    item,
    color,
  };
  dropdownOpen.value = false;
};

const budget = computed(() => budgetStore.budget.budget);

const showChangeBudgetForm = () => {
  optimisticMessage.value = "";
  if (formData.value.expenseForm) formData.value.expenseForm = false;
  formData.value.budgetForm = !formData.value.budgetForm;
};

const showExpenseForm = () => {
  if (formData.value.budgetForm) formData.value.budgetForm = false;
  formData.value.expenseForm = !formData.value.expenseForm;
};

const updateTotalBudget = async () => {
  const value = Number(formData.value.newTotalBudget);
  if (!isNaN(value) && value >= 0) {
    try {
      const updatedBudget = await modifyBudgets(budgetStore.budget._id, value);

      budgetStore.changeBudget(value);

      formData.value.newTotalBudget = "";
      showChangeBudgetForm();

      optimisticMessage.value = `Budget successfully updated to £${value}!`;
    } catch (error) {
      console.error(
        "Failed to update budget:",
        error.response?.data || error.message
      );
      optimisticMessage.value = "Failed to update budget. Please try again.";
    }
  }
};

const addCategory = (newCategory, categoryColor) => {
  budgetStore.addCategory(newCategory, categoryColor);
};

const addNewExpense = async () => {
  const cost = Number(formData.value.costOfExpense);
  if (isNaN(cost) || cost <= 0) return;

  let categoryId;
  let categoryName;

  if (formData.value.newCategory.trim()) {
    const newCategory = await budgetStore.addCategory(
      formData.value.newCategory.trim(),
      formData.value.categoryColor
    );
    categoryId = newCategory._id;
    categoryName = newCategory.name;
  } else if (formData.value.existingCategory) {
    categoryId = formData.value.existingCategory.key;
    categoryName = formData.value.existingCategory.item;
  } else {
    optimisticMessage.value = "Please select or create a category.";
    return;
  }

  try {
    const expenseAdded = await postExpense(
      formData.value.date,
      cost,
      formData.value.description,
      categoryId,
      budgetStore.budget._id
    );

    budgetStore.addExpense(
      cost,
      categoryId,
      budgetStore.budget._id,
      formData.value.date,
      formData.value.description,
      expenseAdded._id
    );

    optimisticMessage.value = `£${cost} successfully added to ${categoryName}!`;
    showExpenseForm();
    formData.value = getInitialData();
  } catch (error) {
    console.error(
      "Failed to save expense:",
      error.response?.data || error.message
    );
    optimisticMessage.value = "Failed to save expense. Please try again.";
  }
};

const showCategoryModal = ref(false);

const openCategoryModal = () => {
  showCategoryModal.value = true;
};

const closeCategoryModal = () => {
  showCategoryModal.value = false;
};
</script>

<template>
  <div>
    <section>
      <div class="home-page-buttons">
        <button class="home-page-button" @click="showExpenseForm">
          Add Expense
        </button>
        <button class="home-page-button" @click="showChangeBudgetForm">
          Change budget
        </button>
      </div>

      <!-- Expense Form -->
      <div class="form-scroll-container" v-if="formData.expenseForm">
        <form class="form" @submit.prevent>
          <!-- Cost -->
          <div class="form-div relative">
            <input
              class="custom-input"
              name="cost"
              v-model.number="formData.costOfExpense"
              type="number"
              min="0"
              step="0.01"
              placeholder=" "
            />
            <label for="cost" class="custom-label">Cost of Expense</label>
          </div>

          <div class="form-div relative">
            <input
              class="custom-input"
              name="description"
              v-model="formData.description"
              type="text"
              placeholder=" "
            />
            <label for="description" class="custom-label">Description</label>
          </div>

          <!-- Date -->
          <div class="form-div relative">
            <input
              class="custom-input"
              type="date"
              v-model="formData.date"
              :max="new Date().toISOString().split('T')[0]"
            />
            <label class="custom-label">Date of Expense</label>
          </div>

          <!-- Existing Category -->
          <div class="form-div">
            <!-- Category Selection Button - Optimized Version -->
            <button
              type="button"
              @click="openCategoryModal"
              class="w-full flex justify-between items-center p-2 rounded-md border border-gray-400 bg-white-smoke text-white-900 dark-theme:bg-gray-700 dark-theme:text-white"
            >
              <span>
                {{ formData.existingCategory?.item || "Select Category" }}
              </span>
              <svg
                class="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          <!-- Category Selection Modal -->
          <transition name="fade">
            <div
              v-if="showCategoryModal"
              class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e1e1e] bg-opacity-80"
              @click.self="closeCategoryModal"
            >
              <div
                class="w-full max-w-md max-h-[80vh] overflow-y-auto bg-[#f8f8f8] dark-theme:bg-gray-900 rounded-lg shadow-xl transform transition-all"
              >
                <!-- Modal Header -->
                <div
                  class="p-4 border-b border-gray-200 dark-theme:border-gray-600"
                >
                  <h3
                    class="text-lg font-medium text-gray-900 dark-theme:text-white"
                  >
                    Select a Category
                  </h3>
                </div>
                <!-- Modal Body (Categories List) -->
                <div class="p-4 space-y-2">
                  <div
                    v-for="(category, index) in categories"
                    :key="index"
                    @click="
                      selectCategory(index, category.name, category.hex_code);
                      closeCategoryModal();
                    "
                    class="px-4 py-3 rounded-md cursor-pointer hover:bg-gray-100 dark-theme:hover:bg-gray-700 text-gray-800 dark-theme:text-white transition-colors"
                    :style="{
                      backgroundColor: changeHSL(colours[index], {
                        s: 100,
                        l: 85,
                      }),
                      borderLeft: `4px solid ${category.hex_code}`,
                    }"
                  >
                    <span class="font-medium">
                      {{ category.name }}
                    </span>
                  </div>
                </div>

                <!-- Modal Footer with Cancel Button -->
                <div
                  class="p-4 border-t border-gray-200 dark-theme:border-gray-700 flex justify-end"
                >
                  <button
                    @click="closeCategoryModal"
                    class="px-4 py-2 text-gray-700 dark-theme:text-gray-300 hover:text-gray-900 dark-theme:hover:text-white focus:outline-none transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </transition>

          <!-- Save Button -->
          <button
            type="button"
            class="home-page-button mt-4"
            @click.prevent="addNewExpense"
          >
            Save
          </button>
        </form>
      </div>

      <!-- Budget Form -->
      <div class="form-scroll-container" v-if="formData.budgetForm">
        <form class="form" @submit.prevent>
          <div class="form-div relative">
            <input
              class="custom-input"
              v-model.number="formData.newTotalBudget"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder=" "
            />
            <label class="custom-label">New Total Budget</label>
          </div>
          <button
            type="button"
            class="home-page-button"
            @click.prevent="updateTotalBudget"
            :disabled="!formData.newTotalBudget"
          >
            Save
          </button>
        </form>
      </div>

      <div
        v-if="optimisticMessage"
        class="fixed inset-x-0 bottom-[20%] flex justify-center z-[1000]"
      >
        <p
          class="text-[#73d622] text-xl md:text-2xl font-bold px-8 py-4 rounded-lg border border-transparent animate-[fadeOut_2s_ease-in-out_forwards] dark-theme:bg-black dark-theme:text-[#8aff33] dark-theme:shadow-lg dark-theme:border-[#73d622]/30"
        >
          {{ optimisticMessage }}
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
@import "tailwindcss";

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  70% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>
