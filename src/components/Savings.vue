<template>
  <div class="savings-container">
    <h1 class="page-title">Savings Goals</h1>

    <div class="savings-cards">
      <div class="savings-card" v-for="goal in savingsGoals" :key="goal.id">
        <div class="card-header">
          <h3>{{ goal.name }}</h3>
          <span class="amount-saved"
            >${{ goal.saved }} of ${{ goal.target }}</span
          >
        </div>
        <div class="progress-bar">
          <div
            class="progress"
            :style="{ width: `${(goal.saved / goal.target) * 100}%` }"
          ></div>
        </div>
        <div class="card-footer">
          <span class="percentage"
            >{{ Math.round((goal.saved / goal.target) * 100) }}%</span
          >
          <button class="add-funds-btn" @click="addToGoal(goal.id)">
            + Add Funds
          </button>
        </div>
      </div>
    </div>

    <button class="new-goal-btn" @click="showNewGoalForm = true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      New Goal
    </button>

    <div v-if="showNewGoalForm" class="form-modal">
      <div class="modal-content">
        <h3>Create New Savings Goal</h3>
        <form @submit.prevent="createNewGoal">
          <div class="form-group">
            <label>Goal Name</label>
            <input type="text" v-model="newGoal.name" required />
          </div>
          <div class="form-group">
            <label>Target Amount</label>
            <input type="number" v-model="newGoal.target" min="1" required />
          </div>
          <div class="form-actions">
            <button
              type="button"
              class="cancel-btn"
              @click="showNewGoalForm = false"
            >
              Cancel
            </button>
            <button type="submit" class="save-btn">Save Goal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const savingsGoals = ref([
  { id: 1, name: "Emergency Fund", saved: 1200, target: 5000 },
  { id: 2, name: "Vacation", saved: 800, target: 2000 },
  { id: 3, name: "New Laptop", saved: 300, target: 1500 },
]);

const showNewGoalForm = ref(false);
const newGoal = ref({
  name: "",
  target: null,
});

const addToGoal = (id) => {
  const goal = savingsGoals.value.find((g) => g.id === id);
  if (goal) {
    const amount = parseFloat(prompt(`How much to add to ${goal.name}?`, "50"));
    if (!isNaN(amount)) {
      goal.saved += amount;
    }
  }
};

const createNewGoal = () => {
  savingsGoals.value.push({
    id: Date.now(),
    name: newGoal.value.name,
    saved: 0,
    target: parseFloat(newGoal.value.target),
  });
  showNewGoalForm.value = false;
  newGoal.value = { name: "", target: null };
};
</script>

<style scoped>
.savings-container {
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.theme-dark .page-title {
  color: whitesmoke;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.savings-cards {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.savings-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.amount-saved {
  color: #73d622;
  font-weight: 600;
}

.progress-bar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #73d622;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.percentage {
  color: #666;
  font-weight: 600;
}

.add-funds-btn {
  background: #f5ffe6;
  color: #73d622;
  border: 1px solid #73d622;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-funds-btn:hover {
  background: #e4f9c5;
}

.new-goal-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: #73d622;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.new-goal-btn:hover {
  background: #5cb615;
}

.form-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
}

.modal-content h3 {
  margin-top: 0;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn {
  background: #f0f0f0;
  color: #666;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
}

.save-btn {
  background: #73d622;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

/* Dark mode styles */
.theme-dark .savings-card,
.theme-dark .modal-content {
  background: #2c2c2c;
  border-color: #444;
}

.theme-dark .card-header h3,
.theme-dark .modal-content h3 {
  color: #f0f0f0;
}

.theme-dark .amount-saved {
  color: #8aff33;
}

.theme-dark .progress {
  background: #8aff33;
}

.theme-dark .add-funds-btn {
  background: #2c2c2c;
  color: #8aff33;
  border-color: #8aff33;
}

.theme-dark .add-funds-btn:hover {
  background: #333;
}

.theme-dark .form-group input {
  background: #333;
  border-color: #444;
  color: white;
}

@media (max-width: 600px) {
  .savings-container {
    padding: 1rem;
  }

  .card-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
  }
}
</style>
