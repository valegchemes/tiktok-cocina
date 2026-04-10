import { create } from 'zustand';

interface RecipeStep {
  text: string;
  timerSeconds?: number;
}

interface RecipeIngredient {
  name: string;
  quantity: string;
  checked?: boolean;
}

interface Recipe {
  id: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

interface AppState {
  activeRecipeId: string | null;
  activeRecipeData: Recipe | null;
  isRecipeSheetOpen: boolean;
  openRecipeSheet: (recipeId: string, recipeData: Recipe) => void;
  closeRecipeSheet: () => void;
}

export const useStore = create<AppState>((set) => ({
  activeRecipeId: null,
  activeRecipeData: null,
  isRecipeSheetOpen: false,
  openRecipeSheet: (recipeId, recipeData) => set({ 
    isRecipeSheetOpen: true, 
    activeRecipeId: recipeId,
    activeRecipeData: recipeData
  }),
  closeRecipeSheet: () => set({ isRecipeSheetOpen: false }),
}));
