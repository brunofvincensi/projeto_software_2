import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { AnimalCardComponent, AnimalDoacao } from '../../components/animal-card/animal-card.component';


export interface Doador {
  nome: string;
  mediaAvaliacao: number;
  localizacao: string;
}

@Component({
  selector: 'app-adocao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    AnimalCardComponent
  ],
  templateUrl: './adocao.component.html',
  styleUrls: ['./adocao.component.css']
})
export class AdocaoComponent implements OnInit {
  animals: AnimalDoacao[] = [];
  filteredAnimals: AnimalDoacao[] = [];

  // Filtros
  filters = {
    especie: '',
    idade: '',
    localizacao: '',
    search: ''
  };

  especies = ['Cão', 'Gato', 'Coelho', 'Pássaro'];
  idades = ['Filhote (0-1 ano)', 'Jovem (1-3 anos)', 'Adulto (3-7 anos)', 'Idoso (7+ anos)'];
  localizacoes = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília'];

  ngOnInit() {
    this.loadAnimals();
  }

  loadAnimals() {
    // Dados mock - substituir por serviço real
    this.animals = [
      {
        id: 1,
        animal: {
          nome: 'Max',
          especie: 'Cão',
          raca: 'Golden Retriever',
          idade: 3,
          imagemUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'
        },
        descricao: 'Max é um cãozinho muito carinhoso e brincalhão.',
        doador: { nome: 'Maria Silva', mediaAvaliacao: 4.8 },
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
        descricao: 'Luna é uma gatinha independente mas muito carinhosa.',
        doador: { nome: 'João Santos', mediaAvaliacao: 4.9},
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
        descricao: 'Bob é um companheiro leal e protetor.',
        doador: { nome: 'Ana Costa', mediaAvaliacao: 4.7 },
        adotado: false
      },
      {
        id: 4,
        animal: {
          nome: 'Mimi',
          especie: 'Gato',
          raca: 'Persa',
          idade: 1,
          imagemUrl: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400'
        },
        descricao: 'Mimi é uma filhotinha muito brincalhona e curiosa.',
        doador: { nome: 'Carlos Lima', mediaAvaliacao: 4.6},
        adotado: false
      },
      {
        id: 5,
        animal: {
          nome: 'Rex',
          especie: 'Cão',
          raca: 'Pastor Alemão',
          idade: 4,
          imagemUrl: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400'
        },
        descricao: 'Rex é um cão inteligente e muito leal à família.',
        doador: { nome: 'Fernanda Rocha', mediaAvaliacao: 4.9 },
        adotado: false
      },
      {
        id: 6,
        animal: {
          nome: 'Lola',
          especie: 'Cão',
          raca: 'Poodle',
          idade: 2,
          imagemUrl: 'https://images.unsplash.com/photo-1616190264687-b7ebf7aa5d4f?w=400'
        },
        descricao: 'Lola é uma cachorrinha dócil e perfeita para apartamento.',
        doador: { nome: 'Ricardo Matos', mediaAvaliacao: 4.8},
        adotado: false
      }
    ];

    this.filteredAnimals = [...this.animals];
  }

  applyFilters() {
    this.filteredAnimals = this.animals.filter(animal => {
      let matches = true;

      if (this.filters.especie && animal.animal.especie !== this.filters.especie) {
        matches = false;
      }

      if (this.filters.idade) {
        const idade = animal.animal.idade;
        const filtro = this.filters.idade;

        if (filtro === 'Filhote (0-1 ano)' && idade > 1) matches = false;
        if (filtro === 'Jovem (1-3 anos)' && (idade < 1 || idade > 3)) matches = false;
        if (filtro === 'Adulto (3-7 anos)' && (idade < 3 || idade > 7)) matches = false;
        if (filtro === 'Idoso (7+ anos)' && idade < 7) matches = false;
      }

      if (this.filters.localizacao !== this.filters.localizacao) {
        matches = false;
      }

      if (this.filters.search &&
          !animal.animal.nome.toLowerCase().includes(this.filters.search.toLowerCase()) &&
          !animal.animal.raca?.toLowerCase().includes(this.filters.search.toLowerCase())) {
        matches = false;
      }

      return matches;
    });
  }

  clearFilters() {
    this.filters = {
      especie: '',
      idade: '',
      localizacao: '',
      search: ''
    };
    this.filteredAnimals = [...this.animals];
  }

  onViewDetails(animal: AnimalDoacao) {
    alert(`Ver detalhes de ${animal.animal.nome}`);
  }

  onInterest(animal: AnimalDoacao) {
    alert(`Você demonstrou interesse por ${animal.animal.nome}`);
  }
}
