import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalDoacao } from 'src/app/models/animal-doacao.model';
import { AnimalDesaparecidoService } from 'src/app/services/animal-desaparecido.service';
import { AnimalDoacaoService } from 'src/app/services/animal-doacao.service';

@Component({
  selector: 'app-animais-doacao-info',
  templateUrl: './animais-doacao-info.component.html',
  styleUrls: ['./animais-doacao-info.component.css']
})
export class AnimaisDoacaoInfoComponent {

  errorMessage: string = ''
  animalDesaparecido?: AnimalDoacao

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AnimalDoacaoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    this.service.findById(id).subscribe({
      next: async (animalDesaparecido: AnimalDoacao) => {
        this.animalDesaparecido = animalDesaparecido
      },
      error: err => {
        this.errorMessage = err
      }
    });
  }

  getImagemCompleta(url?: string): string {
    return `http://localhost:8080/api/uploads/pets/${url}`;
  }

  voltarParaListagem(): void {
    this.router.navigate(['/animais-doacao']);
  }

}
