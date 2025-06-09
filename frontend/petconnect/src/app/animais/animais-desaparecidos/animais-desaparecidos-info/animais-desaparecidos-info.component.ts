import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalDesaparecido } from 'src/app/models/animal-desaparecido.model';
import { AnimalDesaparecidoService } from 'src/app/services/animal-desaparecido.service';

@Component({
  selector: 'app-animais-desaparecidos-info',
  templateUrl: './animais-desaparecidos-info.component.html',
  styleUrls: ['./animais-desaparecidos-info.component.css']
})
export class AnimaisDesaparecidosInfoComponent implements OnInit {

  errorMessage: string = ''
  animalDesaparecido?: AnimalDesaparecido

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AnimalDesaparecidoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    this.service.findById(id).subscribe({
      next: async (animalDesaparecido: AnimalDesaparecido) => {
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
    this.router.navigate(['/animais-desaparecidos']);
  }

}
