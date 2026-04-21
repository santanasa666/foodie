import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriterecipes: [], // Updated to handle favorite articles
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {

    toggleFavorite:  (state, action) => {
      const recipe = action.payload; 
      // find the index of the recipe based on idFood
      const index = state.favoriterecipes.findIndex(
        (item) => item.idFood === recipe.idFood
      );

      if (index >= 0) {
        // if it exists remove it from the array
        state.favoriterecipes.splice(index, 1);
      } else {
        //If it doesn't exist add it to the array
        state.favoriterecipes.push(recipe);
      }
    },
   
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
