import { createSelector } from 'reselect';

// initial selector
const selectCategoryReducer = (state) => state.categories;

export const selectCategories = createSelector(
  // input
  [selectCategoryReducer],
  // output function: only runs when input is different in memory
  (categoriesSlice) => categoriesSlice.categories
);

export const selectCategoriesMap = createSelector(
  [selectCategories],
  (categories) =>
    categories.reduce((acc, category) => {
      const { title, items } = category;
      acc[title.toLowerCase()] = items;
      return acc;
    }, {})
);
