import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Animal } from '../../models/Animal';
import { AnimalService } from '../../services/animal.service';

@Component({
  selector: 'app-pet-detail',
  templateUrl: './pet-detail.component.html',
  styleUrls: ['./pet-detail.component.css']
})
export class PetDetailComponent implements OnInit {
  pet: Animal | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: AnimalService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPet(Number(id));
    }
  }

  loadPet(id: number) {
    this.loading = true;
    this.petService.getPetById(id).subscribe({
      next: (pet) => {
        this.pet = pet;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar detalhes do pet';
        this.loading = false;
        console.error(error);
      }
    });
  }

  adoptPet() {
    if (this.pet?.id) {
      this.router.navigate(['/adopt', this.pet.id]);
    }
  }

  goBack() {
    this.router.navigate(['/pets']);
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
}
