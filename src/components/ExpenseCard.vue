<script setup>
import { computed, reactive, ref } from "vue";
import { changeHSL } from "@/utils/chartData";
import { useSettings } from "./assets/stores/localSettings";
import { useCurrencyFormatter } from "@/utils/useCurrencyFormatter";
import { toPrettyDate } from "@/utils/dateTime";
import { deleteExpense } from "@/api/requests";
import { useStore } from "@/components/assets/stores/currentBudgetData";

const props = defineProps({
  expense: {
    type: Object,
    required: true,
  },
  hex_code: String,
});

const settingsStore = useSettings();
const budgetStore = useStore();
const isDeleted = ref(false);

const formattedAmount = computed(() =>
  useCurrencyFormatter(
    props.expense.amount,
    settingsStore.currency,
    settingsStore.locale
  )
);

const formattedDate = toPrettyDate(props.expense.date);

const borderRad = computed(() =>
  props.hex_code ? "10px 10px 10px" : "10px 10px 10px 10px"
);

const bgColor = computed(() =>
  props.hex_code ? changeHSL(props.hex_code, { s: 100, l: 95 }) : "#BBBBBB"
);

const detailsColor = computed(() =>
  props.hex_code ? changeHSL(props.hex_code, { s: 100, l: 10 }) : "#000000"
);

const width = computed(() => "95%");

const styleObject = reactive({
  width: width,
  borderRadius: borderRad,
  color: detailsColor,
  backgroundColor: bgColor,
  borderStyle: "solid",
  borderColor: detailsColor,
  borderWidth: "2px",
});

const deleteHandler = async () => {
  try {
    isDeleted.value = true;
    await deleteExpense(props.expense._id);

    budgetStore.removeExpense(props.expense._id);

    console.log(`Expense ${props.expense._id} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting expense:", error);
    isDeleted.value = false;
  }
};
</script>

<template>
  <div v-if="!isDeleted" :style="styleObject" class="expenseCard">
    <p class="expenseDescription">{{ props.expense.description }}</p>
    <p>{{ formattedAmount }}</p>
    <p>{{ formattedDate }}</p>

    <button
      @click="deleteHandler"
      class="deleteBtn"
      aria-label="Delete Expense"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="26"
        height="26"
        viewBox="0 0 26 26"
      >
        <path
          d="M 11 -0.03125 C 10.164063 -0.03125 9.34375 0.132813 8.75 0.71875 C 8.15625 1.304688 7.96875 2.136719 7.96875 3 L 4 3 C 3.449219 3 3 3.449219 3 4 L 2 4 L 2 6 L 24 6 L 24 4 L 23 4 C 23 3.449219 22.550781 3 22 3 L 18.03125 3 C 18.03125 2.136719 17.84375 1.304688 17.25 0.71875 C 16.65625 0.132813 15.835938 -0.03125 15 -0.03125 Z M 11 2.03125 L 15 2.03125 C 15.546875 2.03125 15.71875 2.160156 15.78125 2.21875 C 15.84375 2.277344 15.96875 2.441406 15.96875 3 L 10.03125 3 C 10.03125 2.441406 10.15625 2.277344 10.21875 2.21875 C 10.28125 2.160156 10.453125 2.03125 11 2.03125 Z M 4 7 L 4 23 C 4 24.652344 5.347656 26 7 26 L 19 26 C 20.652344 26 22 24.652344 22 23 L 22 7 Z M 8 10 L 10 10 L 10 22 L 8 22 Z M 12 10 L 14 10 L 14 22 L 12 22 Z M 16 10 L 18 10 L 18 22 L 16 22 Z"
        ></path>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.expenseCard {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  gap: 5rem;
  width: 100%;
}

.expenseDescription {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.deleteBtn {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.deleteBtn:hover {
  opacity: 1;
  fill: #fe4a4d;
}

.deleteBtn:focus {
  outline: none;
}

.deleteBtn svg {
  width: 20px;
  height: 20px;
  transition: fill 0.3s ease;
}
</style>
