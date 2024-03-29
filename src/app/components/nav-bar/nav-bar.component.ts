import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '@/services/search.service';
import { FoodType } from '@/utils/enums';
import { FoodFilterService } from '@/services/food-filter.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  links = [
    { path: '/home', label: 'Home' },
    { path: '/explore', label: 'Recipes' },
    { path: '/favourites', label: 'Favourites' },
    { path: '/add', label: 'Add' },
  ];

  dropdownVisible = false;
  FoodType = FoodType;

  constructor(
    public router: Router,
    public searchService: SearchService,
    private foodFilterService: FoodFilterService
  ) {}
  ngAfterViewInit(): void {}

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'f') {
      event.preventDefault();
      if (this.router.url !== '/explore') {
        this.router.navigate(['/explore']).then(() => {
          if (this.searchInput && this.searchInput.nativeElement) {
            this.searchInput.nativeElement.focus();
          }
        });
      } else {
        if (this.searchInput && this.searchInput.nativeElement) {
          this.searchInput.nativeElement.focus();
        }
      }
    }
  }

  addRippleEffect() {
    const button = document.querySelector('.strange-thing');
    if (button) {
      button.classList.add('ripple');
      setTimeout(() => {
        button.classList.remove('ripple');
      }, 1000);
    }
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  selectFoodType(type: FoodType): void {
    this.foodFilterService.changeFoodType(type);
  }
}
