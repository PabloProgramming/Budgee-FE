import axios from "axios";

const api = axios.create({
  baseURL: "https://budgee-be-amq3.onrender.com/api/",
});

export const getExpenses = () => {
  return api.get("/expenses").then(({ data: { allExpenses } }) => {
    return allExpenses;
  });
};

export const getExpensesByCategoryId = (category_id) => {
  return api
    .get(`/expenses/category/${category_id}`)
    .then(({ data: { expenses } }) => {
      return expenses;
    });
};
export const getExpensesByBudgetIdCategoryId = (budget_id, category_id) => {
  return api
    .get(`/expenses/${budget_id}/${category_id}`)
    .then(({ data: { expenses } }) => {
      return expenses;
    });
};
export const postExpense = (
  date,
  amount,
  description,
  category_id,
  budget_id
) => {
  const payload = {
    date: date,
    amount: amount,
    description: description,
    category_id: category_id,
    budget_id: budget_id,
  };

  console.log("Sending payload:", payload);

  return api
    .post("/expenses", payload)
    .then(({ data: { expenseAdded } }) => {
      return expenseAdded;
    })
    .catch((error) => {
      console.error("Full error details:", error.response); // Enhanced logging
      throw error;
    });
};

export const deleteExpense = (id) => {
  return api.delete(`/expenses/${id}`);
};
export const getCategories = () => {
  return api.get("/categories").then(({ data: { categories } }) => {
    return categories;
  });
};
export const postCategory = (name, description, colour_id) => {
  return api
    .post("/categories", {
      name: name,
      description: description,
      colour_id: colour_id,
    })
    .then(({ data: { newCategory } }) => {
      return newCategory;
    });
};

export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};
export const getUsers = () => {
  return api.get("/users").then(({ data: { users } }) => {
    return users;
  });
};
export const getUserById = (user_id) => {
  return api.get(`/users/${user_id}`).then(({ data: { user } }) => {
    return user;
  });
};
export const getBudgetsByUser = (username) => {
  return api.get(`/${username}/budgets`).then(({ data: { budgetsByUser } }) => {
    return budgetsByUser;
  });
};

export const getBudgets = () => {
  return api.get("/budgets").then(({ data: { allBudgets } }) => {
    return allBudgets;
  });
};
export const getBudgetsById = (id) => {
  return api.get(`/budgets/${id}`).then(({ data: { budget } }) => {
    return budget;
  });
};
export const postBudget = (budget, start_date, end_date) => {
  return api
    .post("/budgets", {
      budget: budget,
      start_date: start_date,
      end_date: end_date,
      username: "lisaOliver56",
    })
    .then(({ data: { newBudget } }) => {
      return newBudget;
    });
};
export const modifyBudgets = (_id, newBudgetAmount) => {
  return api
    .patch(`/budgets/${_id}`, {
      budget: newBudgetAmount,
    })
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      console.error(
        "Budget update error:",
        error.response?.data || error.message
      );
      throw error;
    });
};

export const deleteBudget = (id) => {
  return api.delete(`/budgets/${id}`);
};
export const getColours = () => {
  return api.get("/colours").then(({ data: { colours } }) => {
    return colours;
  });
};
export const postColour = (name, hex_code) => {
  return api
    .post("/colours", { name: name, hex_code: hex_code })
    .then(({ data: { newColour } }) => {
      return newColour;
    });
};
export const deleteColour = (id) => {
  return api.delete(`/colours/${id}`);
};

export const PLACEHOLDER_GET_CURR_BUDGET = () => {
  return getBudgets().then((allBudgets) => {
    return allBudgets.at(-1);
  });
};
