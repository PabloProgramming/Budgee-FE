<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <nav class="bottom-nav">
    <div class="nav-container">
      <RouterLink class="nav-item" to="/" active-class="active">
        <svg
          class="nav-icon"
          viewBox="0 0 25 25"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23 9.99V22a2.006 2.006 0 0 1-2 2h-6v-8h-5v8H4a2.006 2.006 0 0 1-2-2V9.99a1.999 1.999 0 0 1 .79-1.59L12.5 1l9.71 7.4A1.999 1.999 0 0 1 23 9.99z"
            fill="currentColor"
          />
        </svg>
        <span class="nav-label">Home</span>
      </RouterLink>

      <RouterLink class="nav-item" to="/expenses" active-class="active">
        <svg
          class="nav-icon"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2a10 10 0 1 0 9.95 11H12V2z" />
          <path d="M13.5 2v9.5H22A8.5 8.5 0 0 0 13.5 2z" />
        </svg>
        <span class="nav-label">Expenses</span>
      </RouterLink>

      <RouterLink class="nav-item" to="/saving-goals" active-class="active">
        <svg
          class="nav-icon"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M8.597 3.2A1 1 0 0 0 7.04 4.289a3.49 3.49 0 0 1 .057 1.795 3.448 3.448 0 0 1-.84 1.575.999.999 0 0 0-.077.094c-.596.817-3.96 5.6-.941 10.762l.03.049a7.73 7.73 0 0 0 2.917 2.602 7.617 7.617 0 0 0 3.772.829 8.06 8.06 0 0 0 3.986-.975 8.185 8.185 0 0 0 3.04-2.864c1.301-2.2 1.184-4.556.588-6.441-.583-1.848-1.68-3.414-2.607-4.102a1 1 0 0 0-1.594.757c-.067 1.431-.363 2.551-.794 3.431-.222-2.407-1.127-4.196-2.224-5.524-1.147-1.39-2.564-2.3-3.323-2.788a8.487 8.487 0 0 1-.432-.287Z"
          />
        </svg>
        <span class="nav-label">Savings</span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f9f9f9;
  border-top: solid 1px #73d622;
  border-radius: 0.5rem;
  z-index: 1000;
  padding: 0.5rem 0;
}

.nav-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 100%;
  margin: 0 auto;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: #444;
  text-decoration: none;
  transition: all 0.2s ease;
  flex: 1;
  max-width: 33%;
}

.nav-item.active {
  color: #73d622;
  background-color: #f5ffe6;
}

.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-bottom: 0.25rem;
}

.nav-label {
  font-size: 0.75rem;
  font-weight: 500;
}

@media (min-width: 768px) {
  .nav-item {
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.8rem;
  }

  .nav-label {
    font-size: 0.875rem;
  }

  .nav-icon {
    margin-bottom: 0;
  }
}
</style>
