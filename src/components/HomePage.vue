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
  budgetStore.getCategories.map((cat) => cat.hex_code)
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

const showOptimisticMessage = (message) => {
  optimisticMessage.value = message;
  setTimeout(() => {
    optimisticMessage.value = "";
  }, 1500);
};

const updateTotalBudget = async () => {
  const value = Number(formData.value.newTotalBudget);
  if (!isNaN(value) && value >= 0) {
    try {
      const updatedBudget = await modifyBudgets(budgetStore.budget._id, value);
      budgetStore.changeBudget(value);
      formData.value.newTotalBudget = "";
      showChangeBudgetForm();
      showOptimisticMessage(`Budget successfully updated to £${value}`);
    } catch (error) {
      console.error(
        "Failed to update budget:",
        error.response?.data || error.message
      );
      showOptimisticMessage("Failed to update budget. Please try again.");
    }
  }
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
    showOptimisticMessage("Please select or create a category.");
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

    showExpenseForm();
    formData.value = getInitialData();
    showOptimisticMessage(`£${cost} successfully added to ${categoryName}`);
  } catch (error) {
    console.error(
      "Failed to save expense:",
      error.response?.data || error.message
    );
    showOptimisticMessage("Failed to save expense. Please try again.");
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
  <div class="home-container">
    <div class="home-page-buttons">
      <button class="home-page-button" @click="showExpenseForm">
        Add Expense
      </button>
      <button class="home-page-button" @click="showChangeBudgetForm">
        Change budget
      </button>
    </div>

    <!-- Optimistic Message -->
    <transition name="fade">
      <div v-if="optimisticMessage" class="mt-10 flex justify-center">
        <p
          :class="[
            'optimistic-message',
            optimisticMessage.includes('Failed') ? 'error' : 'success',
          ]"
        >
          {{ optimisticMessage }}
        </p>
      </div>
    </transition>

    <!-- Expense Form -->
    <div class="form-scroll-container" v-if="formData.expenseForm">
      <form class="responsive-form" @submit.prevent>
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

        <div class="form-div relative">
          <input
            class="custom-input"
            type="date"
            v-model="formData.date"
            :max="new Date().toISOString().split('T')[0]"
          />
          <label class="custom-label">Date of Expense</label>
        </div>

        <div class="form-div">
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

        <transition name="fade">
          <div
            v-if="showCategoryModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e1e1e] bg-opacity-80"
            @click.self="closeCategoryModal"
          >
            <div
              class="w-full max-w-md max-h-[80vh] overflow-y-auto bg-[#f8f8f8] dark-theme:bg-gray-900 rounded-lg shadow-xl transform transition-all"
            >
              <div
                class="p-4 border-b border-gray-200 dark-theme:border-gray-600"
              >
                <h3
                  class="text-lg font-medium text-gray-900 dark-theme:text-white"
                >
                  Select a Category
                </h3>
              </div>
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
                  <span class="font-medium">{{ category.name }}</span>
                </div>
              </div>
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
      <form class="responsive-form" @submit.prevent>
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
  </div>
</template>

<style scoped>
.home-container {
  padding: 1rem;
}

.home-page-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

@media (min-width: 640px) {
  .home-page-buttons {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (min-width: 640px) {
  .home-page-button {
    width: auto;
    min-width: 200px;
  }
}

.responsive-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
}

.form-div {
  width: 100%;
}

@media (min-width: 768px) {
  .responsive-form {
    padding: 1.5rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.optimistic-message {
  display: inline-block;
  padding: 0.75rem 1.25rem;
  font-size: 1.2rem;
  font-weight: 500;
}

.optimistic-message.success {
  color: #86d021;
}

.theme-dark .optimistic-message.success {
  color: #86d021;
}

.optimistic-message.error {
  background-color: #fff5f5;
  color: #a94442;
}

.dark-theme .optimistic-message.error {
  background-color: #4a1c1c;
  color: #ff6b6b;
}
</style>
