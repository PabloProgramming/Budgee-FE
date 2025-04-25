<script setup>
import ThemeToggle from "@/components/ThemeToggle.vue";
import { useUserStore } from "@/components/assets/stores/userStore";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { avatar, username, isLoggedIn } = storeToRefs(userStore);
</script>

<template>
  <div class="header">
    <div class="header-top">
      <div class="theme-toggle">
        <ThemeToggle />
      </div>

      <div v-if="isLoggedIn" class="user-info">
        <img :src="avatar" alt="User avatar" class="user-avatar" />
        <span class="username">@{{ username }}</span>
      </div>
    </div>

    <div class="logo-title">
      <img src="../assets/budgee-logo.png" alt="Budgee logo" class="app-logo" />
      <h1>Budgee</h1>
    </div>
  </div>
</template>

<style scoped>
.header {
  transition: background-color 0.3s ease;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-title {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 3rem;
  font-weight: bold;
  color: #73d622;
}

.app-logo {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #333;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #73d622;
}

.username {
  font-weight: 600;
  color: #555;
}

@media (max-width: 600px) {
  .user-avatar {
    width: 2rem;
    height: 2rem;
  }

  .username {
    font-size: 0.85rem;
  }
}
</style>
