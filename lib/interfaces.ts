export interface SingleRecipe {
  userId?: string;
  isFavorite?: boolean;
  dish?: any;
  name?: boolean;
}

export interface Recipe {
  recipe: SingleRecipe;
}
