import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

// Create the model interface if it doesn't exist
export interface AnimalDoacao {
  id: number;
  animal: {
    nome: string;
    especie: string;
    raca?: string;
    idade: number;
    imagemUrl?: string;
  };
  descricao: string;
  doador: {
    nome: string;
    mediaAvaliacao?: number;
  };
  adotado: boolean;
}

@Component({
  selector: 'app-animal-card',
  templateUrl: './animal-card.component.html',
  styleUrls: ['./animal-card.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ]
})
export class AnimalCardComponent {
  @Input() animalDoacao!: AnimalDoacao;
  @Input() showActions: boolean = true;

  @Output() viewDetails = new EventEmitter<AnimalDoacao>();
  @Output() interest = new EventEmitter<AnimalDoacao>();

  onViewDetails() {
    this.viewDetails.emit(this.animalDoacao);
  }

  onInterest() {
    this.interest.emit(this.animalDoacao);
  }

  getEspecieClass(especie: string): string {
    switch (especie.toLowerCase()) {
      case 'cão':
      case 'cachorro':
        return 'especie-cao';
      case 'gato':
        return 'especie-gato';
      default:
        return 'especie-outros';
    }
  }

  getEspecieIcon(especie: string): string {
    switch (especie.toLowerCase()) {
      case 'cão':
      case 'cachorro':
        return 'pets';
      case 'gato':
        return 'pets';
      default:
        return 'pets';
    }
  }
}
