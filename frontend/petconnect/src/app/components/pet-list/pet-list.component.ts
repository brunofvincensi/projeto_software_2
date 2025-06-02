import { Component, OnInit } from '@angular/core';
import { Animal } from '../../models/Animal';
import { AnimalService } from '../../services/animal.service';

@Component({
  selector: 'app-pet-list',
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.css']
})
export class PetListComponent implements OnInit {
  pets: Animal[] = [];
  filteredPets: Animal[] = [];
  loading = false;
  error = '';

  // Filtros
  searchTerm = '';
  selectedSpecies = '';
  selectedSize = '';

  constructor(private petService: AnimalService) {}

  ngOnInit() {
    this.loadPets();
  }

  loadPets() {
    this.loading = true;
    this.petService.getAnimaisDoacao().subscribe({
      next: (pets) => {
        this.pets = pets;
        this.filteredPets = pets;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar pets';
        this.loading = false;
        console.error(error);
      }
    });
  }

  applyFilters() {
    this.filteredPets = this.pets.filter(pet => {
      const matchesSearch = pet.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           pet.descricao.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesSpecies = !this.selectedSpecies || pet.especie === this.selectedSpecies;
      const matchesSize = !this.selectedSize || pet.descricao === this.selectedSize;

      return matchesSearch && matchesSpecies && matchesSize;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onSpeciesChange() {
    this.applyFilters();
  }

  onSizeChange() {
    this.applyFilters();
  }
}
