<script setup>
import {
  getCategories,
  getColours,
  getExpenses,
  PLACEHOLDER_GET_CURR_BUDGET,
} from "@/api/requests";
import PieChart from "./PieChart.vue";
import { useColourStore } from "./assets/stores/colourStore";

import { useStore } from "./assets/stores/currentBudgetData";
import {
  generateCategoryData,
  generateColorData,
  generateCurrentBudget,
  generateExpenseData,
} from "@/utils/testData";

let categoryData = [];
let budgetStore = useStore();
let colorStore = useColourStore();
let colorData = [];

getColours()
  .then((colorData) => {
    colorData = colorData;
    colorStore.$patch({ colourPalette: colorData });
    return PLACEHOLDER_GET_CURR_BUDGET();
  })
  .then((budgetData) => {
    budgetStore.$patch({ budget: budgetData });
    console.log(budgetData);
    return getCategories();
  })
  .then((res) => {
    categoryData = res;
    return getExpenses();
  })
  .then((expensesData) => {
    const category_ids = categoryData.map((cat) => cat._id);

    categoryData.forEach((cat) => (cat.expenses = []));
    categoryData.forEach((cat) => (cat.confirmed = true));

    for (let expense of expensesData) {
      expense.confirmed = true;
      const index = category_ids.indexOf(expense.category_id);
      if (index === -1) {
        console.warn("no cat found");
      } else {
        categoryData[index].expenses.push(expense);
      }
    }

    budgetStore.$patch({ categories: categoryData });
  })
  .then(() => {})
  .catch((err) => {
    console.log(err);
  });
</script>

<template>
  <div id="bodyDiv">
    <div id="chartContainer">
      <PieChart />
    </div>

    <div id="routerContainer">
      <router-view v-slot="{ Component }">
        <Transition name="slide" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </Transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
#bodyDiv {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem;
  overflow: hidden;
  gap: 1rem;
}

#chartContainer {
  flex: 0 0 auto;
  margin-top: 1rem;
}

#routerContainer {
  flex: 1;
  overflow-y: auto;
  width: 100%;
  padding: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  #bodyDiv {
    padding: 0.5rem;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(50px);
  opacity: 0;
}
</style>
