import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalDoacao } from 'src/app/models/animal-doacao.model';
import { AnimalDoacaoService } from 'src/app/services/animal-doacao.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-animais-doacao',
  templateUrl: './animais-doacao.component.html',
  styleUrls: ['./animais-doacao.component.css']
})
export class AnimaisDoacaoComponent {

  filtros = {
    idade: '',
    especie: '',
    nome: ''
  };

  animais: AnimalDoacao[] = [];

  constructor(
  private router: Router,
  private service: AnimalDoacaoService,
  private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarAnimais();
  }

  // Método para simular dados da API
  carregarAnimais() {
    this.service.findAll(this.filtros).subscribe({
          next: async (data: any) => {
            this.animais = data
          },
          error: err => alert(err)
        });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  limparFiltros() {
    this.filtros = {
      idade: '',
      especie: '',
      nome: ''
    };
    this.carregarAnimais();
  }

  aplicarFiltros() {
    this.carregarAnimais();
  }

  getImagemCompleta(url?: string): string {
    return `http://localhost:8080/api/uploads/pets/${url}`;
  }

  deletarAnimal(animalDesaparecidoId: number): void {
    if (confirm('Tem certeza que deseja excluir esta publicação?')) {
      this.service.delete(animalDesaparecidoId).subscribe({
        next: () => {
          this.animais = this.animais.filter(a => a.id !== animalDesaparecidoId);
        },
        error: (err) => console.error(err)
      });
    }
  }

  isDonoPublicacao(animalUsuarioId: number): boolean {
    return this.authService.getCurrentUser()?.id === animalUsuarioId;
  }

}
