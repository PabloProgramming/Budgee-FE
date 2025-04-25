<script setup>
import Body from "./components/Body.vue";
import Header from "./components/Header.vue";
import Nav from "./components/Nav.vue";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/components/assets/stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const showLoginModal = ref(true);
const username = ref("");
const password = ref("");

const handleLogin = () => {
  showLoginModal.value = false;
  router.push("/");
};

onMounted(() => {
  userStore.setUser({
    _id: "lisa-001",
    username: "lisaoliver",
    name: "Lisa Oliver",
    email: "lisa@example.com",
    avatar: "https://i.pravatar.cc/150?img=47",
    preferences: ["currency=GBP"],
  });
});
</script>

<template>
  <div id="appBody">
    <!-- Login Modal -->
    <div
      v-if="showLoginModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <div
        class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
      >
        <div class="p-8">
          <h2
            class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8"
          >
            Welcome Back
          </h2>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label
                for="username"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                v-model="username"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                v-model="password"
                type="password"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              class="w-full bg-[#73d622] hover:bg-[#77c520] text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>

    <div>
      <Header />
    </div>
    <div class="mainContentDiv">
      <Body />
    </div>
    <footer class="footer">
      <Nav></Nav>
    </footer>
  </div>
</template>

<style scoped>
#appBody {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
}

.footer {
  margin-top: auto;
}
</style>
