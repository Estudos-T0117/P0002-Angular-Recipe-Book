import { Component } from '@angular/core';
import {
  Section,
  Ingredient,
  PreparationStep,
  Recipe,
} from '@/models/recipe.model';
import { FirebaseService } from '@/services/firebase/firebase.service';
import { Timestamp } from 'firebase/firestore';
import { FoodType } from '@/utils/enums';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent {
  sections: Section[] = [];
  selectedType: FoodType = 1;
  condition: number = 1;
  serve: number = 1;
  activeSectionIndex: number = 0;
  recipeName: string = '';
  selectedFile: File | null = null;
  recipeImage: string = '';
  userId: string = ''; // You'll need to set this based on your authentication system

  constructor(private firebaseService: FirebaseService) {}

  validateServe(event: Event) {
    const num = (event.target as HTMLInputElement).value;
    const parsedNum = parseInt(num, 10);

    if (isNaN(parsedNum) || parsedNum < 1 || parsedNum > 32) {
      console.error('Invalid serve value');
      this.serve = 1;
    } else {
      this.serve = parsedNum;
    }
    console.log(this.serve);
  }

  changeCost(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    if (value === '2') {
      this.condition = 2;
    } else if (value === '3') {
      this.condition = 3;
    } else {
      this.condition = 1;
    }
  }

  selectType(type: FoodType) {
    this.selectedType = type;
    console.log(this.selectedType);
  }

  next = false;

  addSection() {
    this.sections.push({
      name: '',
      ingredients: [],
      preparationSteps: [],
    });
    this.activeSectionIndex = this.sections.length - 1;
  }

  addIngredient(sectionIndex: number) {
    this.sections[sectionIndex].ingredients.push({
      name: '',
      quantity: '',
      kind: '',
    });
  }

  addPreparationStep(sectionIndex: number) {
    this.sections[sectionIndex].preparationSteps.push({ description: '' });
  }

  setActiveSection(index: number) {
    this.activeSectionIndex = index;
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async submitRecipe() {
    if (this.selectedFile) {
      this.recipeImage = await this.firebaseService.uploadFile(
        this.selectedFile
      );
    }
    let recipe: Recipe = {
      id: '', // This will be auto-generated by Firebase
      date: Timestamp.fromDate(new Date()).toMillis(), // Current date and time as a Timestamp
      image: this.recipeImage, // The URL of the uploaded image
      name: this.recipeName, // The name of the recipe
      type: this.selectedType,
      userId: this.userId, // The user's ID from your authentication system
      likes: 0, // Initialize likes to 0
      serve: this.serve,
      cost: this.condition,
      sections: this.sections,
    };

    // Log the recipe object to the console (for testing purposes)
    console.log(recipe);

    // Use your FirebaseService to send the recipe object to your backend
    this.firebaseService
      .addRecipe(recipe)
      .then(() => {
        console.log('Recipe successfully added!');
      })
      .catch((error) => {
        console.error('Error adding recipe: ', error);
      });
  }
}
