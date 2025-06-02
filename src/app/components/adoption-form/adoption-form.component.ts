import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Animal } from '../../models/Animal';
import { AnimalDoacao } from '../../models/AnimalDoacao';
import { AnimalService } from '../../services/animal.service';
import { AdoptionService } from '../../services/adoption.service';

@Component({
  selector: 'app-adoption-form',
  templateUrl: './adoption-form.component.html',
  styleUrls: ['./adoption-form.component.css']
})
export class AdoptionFormComponent implements OnInit {
  adoptionForm: FormGroup;
  pet: Animal | null = null;
  loading = false;
  submitting = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private petService: AnimalService,
    private adoptionService: AdoptionService
  ) {
    this.adoptionForm = this.fb.group({
      applicantName: ['', [Validators.required, Validators.minLength(2)]],
      applicantEmail: ['', [Validators.required, Validators.email]],
      applicantPhone: ['', [Validators.required]],
      applicantAddress: ['', [Validators.required]],
      hasExperience: ['', [Validators.required]],
      livingSpace: ['', [Validators.required]],
      otherPets: ['', [Validators.required]],
      motivation: ['', [Validators.required, Validators.minLength(50)]],
      availability: ['', [Validators.required]],
      agreedToTerms: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit() {
    const petId = this.route.snapshot.paramMap.get('id');
    if (petId) {
      this.loadPet(Number(petId));
    }
  }

  loadPet(id: number) {
    this.loading = true;
    // Changed from getPetById to getById (assuming this is the correct method name)
    this.petService.getById(id).subscribe({
      next: (pet: Animal) => {
        this.pet = pet;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Erro ao carregar dados do pet';
        this.loading = false;
        console.error(error);
      }
    });
  }

  onSubmit() {
    if (this.adoptionForm.valid && this.pet?.id) {
      this.submitting = true;

      // Create adoption object matching your AnimalDoacao model
      const adoption: AnimalDoacao = {
        // Changed from petId to animalId (assuming this is the correct property name)
        animalId: this.pet.id,
        adopterId: 1, // TODO: Get from authentication service
        status: 'PENDING',
        applicationDate: new Date(),
        notes: this.getFormattedNotes()
      };

      this.adoptionService.createAdoptionRequest(adoption).subscribe({
        next: (result: any) => {
          this.success = true;
          this.submitting = false;
          setTimeout(() => {
            this.router.navigate(['/pets']);
          }, 3000);
        },
        error: (error: any) => {
          this.error = 'Erro ao enviar solicitação de adoção';
          this.submitting = false;
          console.error(error);
        }
      });
    }
  }

  private getFormattedNotes(): string {
    const form = this.adoptionForm.value;
    return `
      Nome: ${form.applicantName}
      Email: ${form.applicantEmail}
      Telefone: ${form.applicantPhone}
      Endereço: ${form.applicantAddress}
      Experiência com pets: ${form.hasExperience}
      Tipo de moradia: ${form.livingSpace}
      Outros pets: ${form.otherPets}
      Motivação: ${form.motivation}
      Disponibilidade: ${form.availability}
    `;
  }

  goBack() {
    if (this.pet?.id) {
      this.router.navigate(['/pets', this.pet.id]);
    } else {
      this.router.navigate(['/pets']);
    }
  }
}
