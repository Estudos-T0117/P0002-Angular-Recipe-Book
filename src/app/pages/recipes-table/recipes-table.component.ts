// my-component.ts
import { Component } from '@angular/core';
import recipes from '../../../utils/recipes';
import { FoodType } from '@/utils/enums';
import { NavigationService } from '@/services/navigation.service';
import { FoodFilterService } from '@/services/food-filter.service';
import { SearchService } from '@/services/search.service';

@Component({
  selector: 'app-recipes-table',
  templateUrl: './recipes-table.component.html',
  styleUrls: ['./recipes-table.component.scss'],
})
export class RecipesTableComponent {
  searchTerm: string = '';
  selectedFoodType: FoodType | null = null;
  constructor(
    private navigationService: NavigationService,
    private foodFilterService: FoodFilterService,
    private searchService: SearchService
  ) {
    this.foodFilterService.currentFoodType.subscribe(
      (foodType) => (this.selectedFoodType = foodType)
    );
    this.searchService.currentSearchTerm.subscribe((term) => {
      console.log('Received new search term:', term);
      this.searchTerm = term;
    });
  }

  allRecipes: Recipe[] = recipes;
  currentPage: number = 1;
  itemsPerPage: number = 20;

  get currentRecipes(): Recipe[] {
    let filteredRecipes = this.allRecipes;
    if (this.selectedFoodType !== null) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.type === this.selectedFoodType
      );
    }
    if (this.searchTerm !== '') {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return filteredRecipes.slice(start, end);
  }

  get allPages(): number {
    let filteredRecipes = this.allRecipes;
    if (this.selectedFoodType !== null) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.type === this.selectedFoodType
      );
    }
    if (this.searchTerm !== '') {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    return Math.ceil(filteredRecipes.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.allPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  mapFoodTypeName(type: FoodType): string {
    switch (type) {
      case FoodType.Coffee:
        return 'Coffee';
      case FoodType.Lunch:
        return 'Lunch';
      case FoodType.Dinner:
        return 'Dinner';
      case FoodType.Drinks:
        return 'Drinks';
      case FoodType.Others:
        return 'Others';
      default:
        return 'Unknown';
    }
  }
  goto(id: number) {
    this.navigationService.goto(id);
  }
}

interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  image: string;
  date: number;
  likes: number;
  type: FoodType;
}
