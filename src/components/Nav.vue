<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <section class="nav">
    <RouterLink class="nav-item" to="/">
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
    </RouterLink>

    <RouterLink class="nav-item" to="/expenses">
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
    </RouterLink>

    <RouterLink class="nav-item" to="/saving-goals">
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
    </RouterLink>
  </section>
</template>

<style scoped>
.nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem; /* Space evenly between icons */
  padding: 0.8rem 1rem;
  border-top: 2px solid #adee78;
  width: 100%;
  max-width: 500px; /* Optional: keep it tidy on big screens */
}

.nav-item {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5ffe6;
  padding: 0.8rem;
  margin-top: 0.8rem;
  margin-inline: 2rem;
  border-radius: 0.5rem;
  border: 2px solid #73d622;
  box-shadow: 0 4px 6px rgba(134, 208, 33, 0.3);
  color: #73d622;
  transition: transform 0.2s ease, background-color 0.3s ease,
    box-shadow 0.3s ease;
}

.nav-item:hover {
  transform: scale(1.1);
  background-color: #e4f9c5;
  box-shadow: 0 6px 12px rgba(134, 208, 33, 0.4);
}

.nav-icon {
  width: 1.8rem;
  height: 1.8rem;
  fill: currentColor;
  stroke: currentColor;

  pointer-events: none;
}
</style>
