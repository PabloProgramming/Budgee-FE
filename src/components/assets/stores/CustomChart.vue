<script setup>
import { useStore } from "./currentBudgetData";
import { Chart, DoughnutController } from "chart.js";
import { createTypedChart } from "vue-chartjs";

const budgetStore = useStore();

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: {
      labels: [],
      datasets: [
        {
          backgroundColor: [],
          data: [],
        },
      ],
    },
  },
  options: {
    type: Object,
    required: true,
    default: {},
  },
  periodRatio: {
    type: Number,
    required: true,
    default: 0,
  },
});

class Custom extends DoughnutController {
  updateElement(arc, i, properties, mode) {
    const outerRadius = properties.outerRadius;
    const innerRadius = properties.innerRadius;
    properties.innerRadius = innerRadius + this.getDataset().cutouts[i] || 0;
    properties.outerRadius = outerRadius - this.getDataset().cutouts[i] || 0;
    super.updateElement(arc, i, properties, mode);
  }
  draw() {
    super.draw(arguments);
  }
}

Custom.id = "customDoughnut";
Custom.defaults = DoughnutController.defaults;
Chart.register(Custom);

const CustomChart = createTypedChart("customDoughnut", Custom);
</script>

<template>
  <div class="donut-container">
    <CustomChart :data="data" :options="options" />
    <div class="budget-overlay">
      <p class="initial-budget">£{{ budgetStore.budget.budget.toFixed(2) }}</p>
      <p
        :class="[
          'remaining-budget',
          budgetStore.getSpendingLeft >= 0 ? 'positive' : 'negative',
        ]"
      >
        £{{ budgetStore.getSpendingLeft.toFixed(2) }} left
      </p>
    </div>
  </div>
</template>

<style scoped>
.donut-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.budget-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-weight: bold;
  pointer-events: none;
}

.initial-budget {
  font-size: 0.9rem;
  font-weight: bold;
}

.remaining-budget {
  font-size: 0.75rem;
}

.remaining-budget.positive {
  color: #73d622;
}

.remaining-budget.negative {
  color: #dc2626;
}

@media (max-width: 640px) {
  .initial-budget {
    font-size: 0.8rem;
  }

  .remaining-budget {
    font-size: 0.65rem;
  }
}
</style>
