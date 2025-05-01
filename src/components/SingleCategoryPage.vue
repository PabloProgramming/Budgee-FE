<script setup>
import { useRouter } from "vue-router";
import ExpenseCard from "./ExpenseCard.vue";
import { useStore } from "./assets/stores/currentBudgetData";
import { computed, nextTick, reactive, ref } from "vue";

import CategoryCard from "./CategoryCard.vue";
import { changeHSL } from "@/utils/chartData";
import { postExpense } from "@/api/requests";

const router = useRouter();
let budgetStore = useStore();

const newExpenseName = ref("");
const newExpenseAmount = ref("");
const newExpenseAmountError = ref(false);
const newExpenseRefError = ref(false);
const isAdding = ref(false);

const category = computed(
  () =>
    budgetStore.getCategories.find(
      (cat) =>
        cat._id ===
        router.currentRoute.value.fullPath
          .match(/\/[^\/]+/g)
          .at(-1)
          .substring(1)
    ) || {}
);

async function startAdding() {
  isAdding.value = !isAdding.value;
  newExpenseAmountError.value = false;
  newExpenseRefError.value = false;
  newExpenseName.value = "";
  newExpenseAmount.value = "";
  await nextTick();
  document.getElementById("addExpenseReferenceInput").focus();
}

const expensesShown = computed(() => {
  const categoryId = router.currentRoute.value.params.category_id;
  const foundCategory = budgetStore.categories.find(
    (cat) => cat._id === categoryId
  );

  if (!foundCategory) return [];

  // Sort expenses by date
  return [...foundCategory.expenses].sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    return dateDiff !== 0 ? dateDiff : b._id.localeCompare(a._id);
  });
});

const styleObject = reactive({
  color: changeHSL("#222222"),
  backgroundColor: changeHSL("#BBBBBB"),
  "border-style": "solid",
  "border-color": changeHSL("#222222"),
  "border-width": "2px",
});
async function confirmAddExpense() {
  validateAmount({ type: "validate" });
  validateReference();

  if (!newExpenseAmountError.value && !newExpenseRefError.value) {
    const description = newExpenseName.value;
    const refAmount = Number(newExpenseAmount.value.substring(1));
    const date = Date.now();
    const categoryId = category.value._id;
    const budgetId = budgetStore.budget._id;

    newExpenseName.value = "";
    newExpenseAmount.value = "";
    newExpenseAmountError.value = false;
    newExpenseRefError.value = false;
    isAdding.value = false;

    try {
      const savedExpense = await postExpense(
        date,
        refAmount,
        description,
        categoryId,
        budgetId
      );

      budgetStore.addExpense({
        ...savedExpense,
        confirmed: true,
      });
    } catch (err) {
      console.log("Error posting expense:", err);
    }
  } else {
    // Trigger the shake animation when validation fails
    if (newExpenseRefError.value) {
      document
        .getElementById("addExpenseReferenceInput")
        .classList.add("shake");
      setTimeout(() => {
        document
          .getElementById("addExpenseReferenceInput")
          .classList.remove("shake");
      }, 500);
    }
    if (newExpenseAmountError.value) {
      document.getElementById("addExpenseAmountInput").classList.add("shake");
      setTimeout(() => {
        document
          .getElementById("addExpenseAmountInput")
          .classList.remove("shake");
      }, 500);
    }
  }
}

function handleCompleteReference() {
  document.getElementById("addExpenseAmountInput").focus();
}

async function validateReference(event) {
  if (newExpenseName.value) {
    newExpenseRefError.value = false;
  } else {
    newExpenseRefError.value = true;
  }
}
async function validateAmount(event) {
  newExpenseAmount.value = "£" + newExpenseAmount.value.split("£").at(-1);
  if (event.type === "focus") {
  } else {
    if (
      /^[1-9][0-9]*.?[0-9]{0,2}$/.test(newExpenseAmount.value.split("£").at(-1))
    ) {
      newExpenseAmountError.value = false;
    } else {
      newExpenseAmountError.value = true;
    }
  }
}
</script>

<template>
  <div>
    <div class="categoryList">
      <div class="singleCatDivBox">
        <CategoryCard
          class="catHeader"
          :key="category._id"
          :id="category._id"
          :confirmed="category.confirmed"
          :name="category.name"
          :amount="category.amount"
          :percentage="category.percentage"
          :hex_code="category.hex_code"
        >
        </CategoryCard>
        <button
          class="addExpenseButton"
          :style="styleObject"
          @click="startAdding"
        >
          +
        </button>
      </div>

      <div v-if="isAdding" class="addExpenseCard" :style="styleObject">
        <input
          :class="newExpenseRefError ? 'error-border' : ''"
          v-model="newExpenseName"
          @blur="validateReference($event)"
          placeholder="Reference"
          id="addExpenseReferenceInput"
        />
        <input
          :class="newExpenseAmountError ? 'error-border' : ''"
          v-model="newExpenseAmount"
          @blur="validateAmount($event)"
          placeholder=" Amount (£)"
          id="addExpenseAmountInput"
        />
        <button @click="confirmAddExpense" class="saveButton">Save</button>
      </div>

      <div>
        <ExpenseCard
          v-for="expense in expensesShown"
          :key="expense._id"
          :expense="expense"
          :hex_code="category.hex_code"
        ></ExpenseCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
#addExpenseReferenceInput,
#addExpenseAmountInput {
  text-align: center;
  width: 80%;
  align-items: center;
  margin: auto;
  outline: none;
  border: 2px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  transition: border-color 0.3s ease, border-width 0.3s ease;
}

.addExpenseButton:hover {
  background-color: #86d021;
  transform: scale(1.08);
}

.addExpenseButton:active {
  transform: scale(1);
}

.error-border {
  border-color: #ff4757 !important;
  background-color: #fff6f6;
  animation: shake 0.5s ease;
}

.singleCatDivBox {
  display: grid;
  grid-template-columns: 8fr 1fr;
}

.saveButton {
  background-color: #86d021;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.saveButton:hover {
  background-color: #74b719;
  transform: scale(1.05);
}

.saveButton:active {
  background-color: #64a113;
}

.saveButton:disabled {
  background-color: #c7e8a3;
  cursor: not-allowed;
}
</style>
