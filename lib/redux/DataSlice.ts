import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { SingleRecipe } from '../interfaces'

export interface initialState {
  recipeData: SingleRecipe
}

const initialState: initialState = {
  recipeData: {}
}

export const dataSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setRecipeData: (state, action: PayloadAction<SingleRecipe>) => {
        state.recipeData = action.payload
        }
  },
})

// Action creators are generated for each case reducer function
export const { setRecipeData } = dataSlice.actions

export default dataSlice.reducer