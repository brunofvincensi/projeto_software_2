import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AnimalCardComponent } from '../../components/animal-card/animal-card.component';

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
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    AnimalCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredAnimals: AnimalDoacao[] = [];
  stats = {
    animalsAdopted: 1247,
    animalsAvailable: 89,
    happyFamilies: 856
  };

  ngOnInit() {
    this.loadFeaturedAnimals();
  }

  loadFeaturedAnimals() {
    // Dados mock - substituir por serviço real depois
    this.featuredAnimals = [
      {
        id: 1,
        animal: {
          nome: 'Max',
          especie: 'Cão',
          raca: 'Golden Retriever',
          idade: 3,
          imagemUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'
        },
        descricao: 'Max é um cãozinho muito carinhoso e brincalhão. Adora crianças e outros pets.',
        doador: {
          nome: 'Maria Silva',
          mediaAvaliacao: 4.8
        },
        adotado: false
      },
      {
        id: 2,
        animal: {
          nome: 'Luna',
          especie: 'Gato',
          raca: 'Siamês',
          idade: 2,
          imagemUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400'
        },
        descricao: 'Luna é uma gatinha independente mas muito carinhosa. Perfeita para apartamento.',
        doador: {
          nome: 'João Santos',
          mediaAvaliacao: 4.9
        },
        adotado: false
      },
      {
        id: 3,
        animal: {
          nome: 'Bob',
          especie: 'Cão',
          raca: 'SRD',
          idade: 5,
          imagemUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400'
        },
        descricao: 'Bob é um companheiro leal e protetor. Ideal para famílias com casa e quintal.',
        doador: {
          nome: 'Ana Costa',
          mediaAvaliacao: 4.7
        },
        adotado: false
      }
    ];
  }

  onViewDetails(animal: AnimalDoacao) {
    console.log('Ver detalhes:', animal);
    // Navegar para página de detalhes
  }

  onInterest(animal: AnimalDoacao) {
    console.log('Interesse em:', animal);
    // Implementar lógica de interesse
  }
}
