<script setup>
import { ref, computed, onMounted, reactive, nextTick } from "vue";
import CategoryList from "./CategoryList.vue";

import { useStore } from "./assets/stores/currentBudgetData";
import { changeHSL } from "@/utils/chartData";
import { useColourStore } from "./assets/stores/colourStore";
import { postCategory } from "@/api/requests";
import ColourPreview from "./ColourPreview.vue";
import "tailwindcss";

let budgetStore = useStore();
let colourStore = useColourStore();
let colourId = "";

const errorMessage = ref(false);
const newCategoryName = ref("");

const isAdding = ref(false);

function confirmAddCategory() {
  if (!newCategoryName._value && !colourId) {
    errorMessage.value = "Please enter a new category name and choose a colour";

    console.log(errorMessage, "error message");
  } else if (!newCategoryName._value) {
    errorMessage.value = "Please enter a new category name";
  } else if (!colourId) {
    errorMessage.value = "Please choose a colour";
  } else if (newCategoryName._value && colourId) {
    if (newCategoryName.value.trim()) {
      const catName = newCategoryName.value;
      newCategoryName.value = "";
      isAdding.value = false;
      const tempID = String(Math.round(Math.random() * 10 ** 10));

      budgetStore.addCategory(catName.trim(), "", tempID, colourId);

      console.log(budgetStore.categories);
      errorMessage.value = "";
      return postCategory(catName.trim(), "--", colourId)
        .then((response) => {
          budgetStore.confirmCategory(tempID);
        })
        .catch((err) => {
          console.log(err, "err");
          errorMessage.value = "Failed to add category, please try again";
        });
    } else {
      newCategoryName.value = "";
      isAdding.value = false;
    }
  }
}

function handleColourClick(colour) {
  colourStore.setSelectedColour(colour);
  colourId = colourStore.getSelectedColour._id;
}
const selectedCurrency = ref(0);

const currencyLocales = {
  GBP: "en-GB",
  USD: "en-US",
  EUR: "de-DE",
  JPY: "ja-JP",
};

const selectedLocale = computed(() => currencyLocales[selectedCurrency.value]);
async function startAdding() {
  isAdding.value = true;
  newCategoryName.value = "";
  await nextTick();
  document.getElementById("addCategoryNameInput").focus();
}

const styleObject = reactive({
  color: changeHSL("#000000"),
  backgroundColor: changeHSL("#BBBBBB"),
  "border-style": "solid",
  "border-color": changeHSL("#000000"),
  "border-width": "2px",
});
</script>

<template>
  <div>
    <CategoryList :categories="budgetStore.getCategories" />

    <button
      v-if="!isAdding"
      class="addCategoryButton"
      :style="styleObject"
      @click="startAdding"
    >
      +
    </button>

    <div v-if="errorMessage">
      <p
        class="text-[#aa4a44] text-center text-xl md:text-2xl font-bold px-8 py-4 rounded-lg border border-transparent animate-[fadeOut_2s_ease-in-out_forwards] dark-theme:bg-black dark-theme:text-[#8AFF33] dark-theme:shadow-lg dark-theme:border-[#73D622]/30"
      >
        {{ errorMessage }}
      </p>
    </div>

    <div v-if="isAdding" class="addCategoryCard" :style="styleObject">
      <input
        v-model="newCategoryName"
        @keyup.enter="confirmAddCategory"
        placeholder="Enter category name"
        id="addCategoryNameInput"
      />

      <div>
        <p>Choose Colour</p>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="colour in colourStore.getPalette"
            :key="colour._id"
            :title="colour.name"
            class="w-8 h-8 border border-black rounded cursor-pointer"
            :style="{ backgroundColor: colour.hex_code }"
            @click.stop.prevent="handleColourClick(colour)"
          >
            <div
              v-if="colourStore.selectedColour?.hex_code === colour.hex_code"
              class="w-full h-full border-4 border-white rounded-full"
            ></div>
          </div>
        </div>
      </div>
      <button @click="confirmAddCategory">Save</button>
    </div>
  </div>
</template>

<style scoped>
#addCategoryNameInput {
  text-align: center;
  width: 80%;
  align-items: center;
  margin: auto;
  outline: none;
}
</style>
