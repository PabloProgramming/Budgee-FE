<script setup>
import { changeHSL } from "@/utils/chartData";
import { computed, reactive } from "vue";
import { useSettings } from "./assets/stores/localSettings";
import { useCurrencyFormatter } from "@/utils/useCurrencyFormatter";
import { toPrettyDate } from "@/utils/dateTime";

const props = defineProps({
  expense: {
    type: Object,
    required: true,
  },
  hex_code: String,
});

const settingsStore = useSettings();

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
</script>

<template>
  <RouterLink
    :to="`/expenses/${props.expense.category_id}`"
    :style="styleObject"
    class="expenseCard"
  >
    <p>{{ props.expense.description }}</p>
    <p>{{ formattedAmount }}</p>
    <p>{{ formattedDate }}</p>
  </RouterLink>
</template>

<style scoped></style>
