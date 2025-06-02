import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Fix 1: Import PetCardComponent correctly (matching your actual component name)
import { PetCardComponent } from '../../components/animal-card/animal-card.component';

// Fix 2: Import AnimalDoacao from the correct models folder
import { AnimalDoacao } from '../../models/AnimalDoacao';
import { Animal } from '../../models/Animal';

// Import services
import { AdoptionService } from '../../services/adoption.service';
import { AnimalService } from '../../services/animal.service';

@Component({
  selector: 'app-adocao',
  standalone: true,
  // Fix 3: Correct imports array with proper components
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PetCardComponent
  ],
  templateUrl: './adocao.component.html',
  styleUrls: ['./adocao.component.css']
})
export class AdocaoComponent implements OnInit {
  animals: Animal[] = [];
  adoptions: AnimalDoacao[] = [];
  filteredAnimals: Animal[] = [];
  loading = true;
  error: string | null = null;

  // Filter properties
  selectedSpecies = '';
  selectedSize = '';
  selectedAge = '';
  searchTerm = '';

  constructor(
    private animalService: AnimalService,
    private adoptionService: AdoptionService
  ) {}

  ngOnInit(): void {
    this.loadAnimalsForAdoption();
  }

  loadAnimalsForAdoption(): void {
    this.loading = true;
    this.error = null;

    // Fix: Use the correct method that returns AnimalDoacao[]
    this.adoptionService.getAllAdoptions().subscribe({
      next: (adoptions: AnimalDoacao[]) => {
        // Extract animals from adoptions that are available
        this.animals = adoptions
          .filter(adoption => !adoption.adotado)
          .map(adoption => adoption.animal);
        this.filteredAnimals = this.animals;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading animals for adoption:', error);
        this.error = 'Erro ao carregar animais para adoção';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredAnimals = this.animals.filter(animal => {
      const matchesSpecies = !this.selectedSpecies || animal.especie === this.selectedSpecies;
      // Fix: Use the correct property name from your Animal model
      const matchesSize = !this.selectedSize || animal.descricao === this.selectedSize;
      const matchesAge = !this.selectedAge || this.getAgeCategory(animal) === this.selectedAge;
      const matchesSearch = !this.searchTerm ||
        animal.nome?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        animal.descricao?.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesSpecies && matchesSize && matchesAge && matchesSearch;
    });
  }

  private getAgeCategory(animal: Animal): string {
    if (!animal.idade) return '';

    const age = animal.idade;
    if (age < 1) return 'filhote';
    if (age < 7) return 'adulto';
    return 'idoso';
  }

  onSpeciesChange(): void {
    this.applyFilters();
  }

  onSizeChange(): void {
    this.applyFilters();
  }

  onAgeChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedSpecies = '';
    this.selectedSize = '';
    this.selectedAge = '';
    this.searchTerm = '';
    this.filteredAnimals = this.animals;
  }
}
