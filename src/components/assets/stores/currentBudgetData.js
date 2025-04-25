import {defineStore, storeToRefs} from "pinia";
import {useColourStore} from "./colourStore";

export const useStore = defineStore("budgetData", {
  state: () => {
    return {
      categories: [],
      budget: {
        _id: 1,
        budget: 0,
        interval: {start_date: new Date(), end_date: new Date()},
      },
    };
  },

  actions: {
    confirmCategory(tempID) {
      this.categories.find((cat) => cat._id == tempID).confirmed = true;
      console.log(this.categories);
    },
    deleteCategoryHandler(category_id) {
      for (let i = 0; i < this.categories.length; i++) {
        console.log(this.categories[i]);
        if (this.categories[i]._id === category_id) {
          this.categories.splice(i, 1);
        }
      }
    },
    confirmExpense(tempID) {
      for (let cat of this.categories) {
        cat.expenses.forEach((expense) => console.log(expense._id));
        console.log(
          cat.expenses.find((expense) => expense._id == tempID) || {}
        );
        (
          cat.expenses.find((expense) => expense._id == tempID) || {}
        ).confirmed = true;
      }
    },
    addExpense(amount, categoryId, budgetId, date, description, expenseId) {
      const category = this.categories.find((cat) => cat._id === categoryId);
      if (!category) {
        console.error(`Category ${categoryId} not found!`);
        return false;
      }

      category.expenses.push({
        _id: expenseId,
        amount,
        budget_id: budgetId,
        category_id: categoryId,
        date,
        description,
        confirmed: false,
      });
    },
    addCategory(name, description, categoryId=this.categories.length, colourId = 301){
      
      const newCategory = {
        _id: categoryId,
        colour_id: colourId,
        description,
        expenses: [],
        name,
        confirmed: false,
        
      }
      
      this.categories.push(newCategory)
      
      
    },

    changeBudget(newTotalBudget) {
      this.$patch({budget: {budget: newTotalBudget}});
    },
  },
  getters: {
    getCategories: (state) => {
      let colorStore = useColourStore();
      const newCategories = state.categories.map((cat) => {
        const newCat = {...cat};
        newCat.amount =
          Math.round(
            100 *
              newCat.expenses.reduce((acc, curr) => {
                return acc + curr.amount;
              }, 0)
          ) / 100;
        delete newCat.expenses;
        return newCat;
      });
      const totalSpend = newCategories.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
      newCategories.forEach(
        (cat) =>
          (cat.percentage = Math.round((cat.amount / totalSpend) * 10000) / 100)
      );
      newCategories.forEach(
        (cat) => (cat.hex_code = colorStore.getHexFromId(cat.colour_id))
      );
      return newCategories;
    },
    getCatNames: (state) => {
      return state.categories.map((cat) => {
        return cat.name;
      });
    },
    getCatAmounts: (state) => {
      return state.categories.map((cat) => {
        return (
          Math.round(
            100 *
              cat.expenses.reduce((acc, curr) => {
                return acc + curr.amount;
              }, 0)
          ) / 100
        );
      });
    },
    getCatPieDataFull() {
      const getNewPie = structuredClone(this.getCatPieData);

      getNewPie.labels.push("Remaining");
      getNewPie.datasets[0].backgroundColor.push("#73d622");

      getNewPie.datasets[0].data.push(this.getSpendingLeft);
      getNewPie.datasets[0].budgetInfo = [
        this.getSpendingLeft,
        this.budget.budget,
      ];
      return getNewPie;
    },
    getCatPieData: (state) => {
      let colorStore = useColourStore();
      return {
        labels: state.categories.map((cat) => {
          return cat.name;
        }),
        datasets: [
          {
            _ids: state.categories.map((cat) => cat._id),
            backgroundColor: state.categories.map((cat) =>
              colorStore.getHexFromId(cat.colour_id)
            ),
            data: state.categories.map((cat) => {
              return (
                Math.round(
                  100 *
                    cat.expenses.reduce((acc, curr) => {
                      return acc + curr.amount;
                    }, 0)
                ) / 100
              );
            }),
          },
        ],
      };
    },
    getRatioLeftOfPeriod() {
      return (
        (Date.now() - this.budget.interval.start_date) /
        (this.budget.interval.end_date - this.budget.interval.start_date)
      );
    },
    getSpendingLeft() {
      return (
        this.budget.budget -
        this.getCatAmounts.reduce((acc, curr) => acc + curr, 0)
      );
    },
  },
});

