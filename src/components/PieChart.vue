<script setup>
import { computed } from "vue";
import PieChartComponent from "./PieChartComponent.vue";
import { useStore } from "./assets/stores/currentBudgetData";

const budgetStore = useStore();
const chartData = computed(() => budgetStore.getCatPieDataFull);
</script>

<template>
  <div id="pieChartContainer">
    <PieChartComponent
      :chartData="chartData"
      :periodRatio="budgetStore.getRatioLeftOfPeriod"
    />
  </div>
</template>

<style scoped>
#pieChartContainer {
  height: 300px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  position: relative;
}

@media (max-width: 640px) {
  #pieChartContainer {
    height: 250px;
  }
}
</style>
