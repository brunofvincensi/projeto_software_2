import { Component, Input } from '@angular/core';
import { Animal } from '../../models/Animal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pet-card',
  templateUrl: '../animal-card/animal-card.component.html',
  styleUrls: ['../animal-card/animal-card.component.css']
})
export class PetCardComponent {
  @Input() pet!: Animal;

  constructor(private router: Router) {}

  viewDetails() {
    this.router.navigate(['/pets', this.pet.id]);
  }

  adoptPet() {
    this.router.navigate(['/adopt', this.pet.id]);
  }

  getSpeciesName(species: string): string {
    const speciesMap: { [key: string]: string } = {
      'DOG': 'Cachorro',
      'CAT': 'Gato',
      'BIRD': 'Pássaro',
      'OTHER': 'Outro'
    };
    return speciesMap[species] || species;
  }

  getSizeName(size: string): string {
    const sizeMap: { [key: string]: string } = {
      'SMALL': 'Pequeno',
      'MEDIUM': 'Médio',
      'LARGE': 'Grande'
    };
    return sizeMap[size] || size;
  }

  getGenderName(gender: string): string {
    const genderMap: { [key: string]: string } = {
      'MALE': 'Macho',
      'FEMALE': 'Fêmea'
    };
    return genderMap[gender] || gender;
  }

  truncateDescription(description: string, maxLength: number = 100): string {
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + '...';
  }
}
