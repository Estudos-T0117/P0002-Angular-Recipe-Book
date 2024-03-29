// recipe.model.ts
import { FoodType } from '../utils/enums';

export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  image: string;
  date: number;
  likes: number;
  type: FoodType;
}
