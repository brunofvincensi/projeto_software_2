import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  usuarioId?: number;
  modoEdicao: boolean = false;
  errorMessage = '';
  registerForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: [''],
    telefone: ['', [Validators.required]],
    dataNascimento: ['', [Validators.required, this.idadeValidator.bind(this)]],
  });

  // Data máxima permitida (13 anos atrás da data atual)
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 13));
  // Variáveis para avaliação
  rating: number = 0;
  hoverRating: number = 0;
  avaliacaoForm = this.fb.group({
    observacao: ['', [Validators.required, Validators.maxLength(500)]],
    nota: [0, [Validators.required, Validators.min(1), Validators.max(5)]]
  });

  mediaAvaliacoes: number = 0
  stars: number[] = [1, 2, 3, 4, 5];
  avaliacaoEnviada: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.usuarioId = +params['id'];
        this.carregarUsuarioParaEdicao(this.usuarioId)
      }
    });
    this.registerForm.get("email")?.disable()
  }

  carregarUsuarioParaEdicao(id: number): void {
    this.authService.getUsuarioById(id).subscribe({
      next: (usuario) => {
        this.registerForm.patchValue({
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone,
          dataNascimento: this.formatarData(usuario.dataNascimento)
        });

        this.mediaAvaliacoes = usuario.avaliacao;
        if (this.authService.getCurrentUser()?.id == id) {
          this.modoEdicao = true
        } else {
          this.registerForm.disable();
        }
      },
      error: (err) => console.error('Erro ao carregar usuário', err)
    });
  }

  formatarData(data: string): string {
    return data.split('T')[0];
  }

  // Validador com tipagem explícita
  private idadeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const nascimento = new Date(control.value);
    const hoje = new Date();
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNasc = nascimento.getMonth();

    // Verifica se já fez aniversário este ano
    const jaFezAniversario = (mesAtual > mesNasc) ||
                          (mesAtual === mesNasc && hoje.getDate() >= nascimento.getDate());

    return (jaFezAniversario ? idade : idade - 1) >= 13 ? null : { idadeMinima: true };
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.getRawValue();
      await this.authService.update(formValue).then(() => {
        const usuario = this.authService.getCurrentUser() as Usuario;
        usuario.nome = formValue.nome
        usuario.dataNascimento = formValue.dataNascimento
        usuario.telefone = formValue.telefone
        alert("Sucesso")
      }).catch(err => {
        this.errorMessage = err;
      })
    }
  }

    setRating(rating: number): void {
    this.rating = rating;
    this.avaliacaoForm.get('nota')?.setValue(rating);
    this.hoverRating = rating;
  }

  setHoverRating(rating: number): void {
    if (!this.rating) {
      this.hoverRating = rating;
    }
  }

  resetHoverRating(): void {
    this.hoverRating = this.rating;
  }

  enviarAvaliacao(): void {
    if (this.avaliacaoForm.valid) {
      const dadosAvaliar = {
        ...this.avaliacaoForm.value,
        idUsuario: this.usuarioId
      };

      this.authService.avaliar(dadosAvaliar).subscribe({
					next: async (data: any) => {
            // Aqui você faria a chamada HTTP para salvar a avaliação
            this.avaliacaoEnviada = true;
            if (this.usuarioId) this.carregarUsuarioParaEdicao(this.usuarioId);
					},
					error: err => {
            throw err;
          }
				});
    }
  }

  getStarsArray(media: number): any[] {
    const fullStars = Math.floor(media);
    const hasHalfStar = media % 1 >= 0.5;

    return this.stars.map(star => {
      if (star <= fullStars) return 'full';
      if (star === fullStars + 1 && hasHalfStar) return 'half';
      return 'empty';
    });
  }

}
