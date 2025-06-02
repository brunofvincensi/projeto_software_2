import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Animal } from '../../models/Animal';
import { AnimalService } from '../../services/animal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredPets: Animal[] = [];
  loading = false;
  stats = {
    totalPets: 0,
    adoptedPets: 0,
    happyFamilies: 0
  };

  constructor(
    private petService: AnimalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFeaturedPets();
    this.loadStats();
  }

  loadFeaturedPets() {
    this.loading = true;
    this.petService.getFeaturedPets().subscribe({
      next: (pets) => {
        this.featuredPets = pets.slice(0, 6); // Show only 6 pets
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading featured pets:', error);
        this.loading = false;
      }
    });
  }

  loadStats() {
    // In a real app, these would come from API calls
    this.stats = {
      totalPets: 247,
      adoptedPets: 189,
      happyFamilies: 156
    };
  }

  navigateToPets() {
    this.router.navigate(['/pets']);
  }

  navigateToAdoption(petId: number) {
    this.router.navigate(['/adopt', petId]);
  }
}
