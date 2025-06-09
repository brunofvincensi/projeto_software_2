import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalDesaparecido } from 'src/app/models/animal-desaparecido.model';
import { AnimalDesaparecidoService } from 'src/app/services/animal-desaparecido.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-animais-desaparecidos',
  templateUrl: './animais-desaparecidos.component.html',
  styleUrls: ['./animais-desaparecidos.component.css']
})
export class AnimaisDesaparecidosComponent implements OnInit {

  filtros = {
    local: '',
    especie: '',
    nome: ''
  };

  animais: AnimalDesaparecido[] = [];

  constructor(
  private router: Router,
  private service: AnimalDesaparecidoService,
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
      local: '',
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
