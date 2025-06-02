import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AnimalService } from '../../services/animal.service';
import { AdoptionService } from '../../services/adoption.service';
import { AuthService } from '../../services/auth.service'; // Assuming you have this
import { Animal } from '../../models/Animal';
import { AnimalDoacao } from '../../models/AnimalDoacao';
import { Usuario } from '../../models/Usuario';

@Component({
  selector: 'app-adoption-form',
  templateUrl: './adoption-form.component.html',
  styleUrls: ['./adoption-form.component.css']
})
export class AdoptionFormComponent implements OnInit {
  adoptionForm!: FormGroup;
  pet: Animal | null = null;
  submitting = false;
  loading = true;
  currentUser: Usuario | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private animalService: AnimalService,
    private adoptionService: AdoptionService,
    private authService: AuthService // Add this service
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadPetData();
  }

  private initializeForm(): void {
    this.adoptionForm = this.fb.group({
      adopterName: ['', [Validators.required, Validators.minLength(2)]],
      adopterEmail: ['', [Validators.required, Validators.email]],
      adopterPhone: ['', [Validators.required]],
      adopterAddress: ['', [Validators.required]],
      hasExperience: [false],
      livingSituation: ['', [Validators.required]],
      otherPets: [''],
      reasonForAdoption: ['', [Validators.required, Validators.minLength(10)]],
      additionalNotes: ['']
    });
  }

  private loadCurrentUser(): void {
    // Assuming your auth service has a getCurrentUser method
    this.authService.getCurrentUser().subscribe({
      next: (user: Usuario) => {
        this.currentUser = user;
      },
      error: (error: any) => {
        console.error('Error loading current user:', error);
        // Handle error - maybe redirect to login
      }
    });
  }

  private loadPetData(): void {
    const petId = this.route.snapshot.paramMap.get('id');
    if (petId) {
      // Use the correct method name for your AnimalService
      this.animalService.getAnimalById(Number(petId)).subscribe({
        next: (animal: Animal) => {
          this.pet = animal;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading pet data:', error);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  onSubmit(): void {
    if (this.adoptionForm.valid && this.pet?.id && this.currentUser) {
      this.submitting = true;

      // Create adoption object matching your AnimalDoacao model
      const adoption: AnimalDoacao = {
        titulo: `Solicitação de adoção - ${this.pet.nome || 'Animal'}`,
        descricao: this.getFormattedNotes(),
        dataPublicacao: new Date(),
        animal: this.pet,
        doador: this.currentUser, // The current user is the one giving up the pet
        adotante: this.createAdopterFromForm(), // Create adopter from form data
        adotado: false
      };

      // Submit the adoption
      this.adoptionService.submitAdoption(adoption).subscribe({
        next: (response: AnimalDoacao) => {
          this.submitting = false;
          console.log('Adoption request submitted successfully', response);
          // Redirect to success page or pet list
          this.router.navigate(['/adoption-success'], {
            queryParams: { petName: this.pet?.nome }
          });
        },
        error: (error: any) => {
          this.submitting = false;
          console.error('Error submitting adoption request', error);
          // Show error message to user
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.adoptionForm.markAllAsTouched();
    }
  }

  private getFormattedNotes(): string {
    const formValue = this.adoptionForm.value;
    return `
Dados do Adotante:
Nome: ${formValue.adopterName}
Email: ${formValue.adopterEmail}
Telefone: ${formValue.adopterPhone}
Endereço: ${formValue.adopterAddress}

Informações Adicionais:
Tem experiência com pets: ${formValue.hasExperience ? 'Sim' : 'Não'}
Situação de moradia: ${formValue.livingSituation}
Outros pets: ${formValue.otherPets || 'Nenhum'}
Motivo da adoção: ${formValue.reasonForAdoption}
Observações: ${formValue.additionalNotes || 'Nenhuma'}
    `.trim();
  }

  private createAdopterFromForm(): Usuario {
    const formValue = this.adoptionForm.value;
    // Create a basic Usuario object from form data
    // You might need to adjust this based on your Usuario model
    return {
      id: 0, // Will be set by backend
      nome: formValue.adopterName,
      email: formValue.adopterEmail,
      telefone: formValue.adopterPhone,
      endereco: formValue.adopterAddress,
      // Add other required Usuario properties with default values
    } as Usuario;
  }

  goBack(): void {
    this.location.back();
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.adoptionForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.adoptionForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} é obrigatório`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `${fieldName} muito curto`;
    }
    return '';
  }
}
