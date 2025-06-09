import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  errorMessage = '';
  registerForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required]],
    dataNascimento: ['', [Validators.required, this.idadeValidator.bind(this)]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmSenha: ['']
  }, { validator: this.passwordMatchValidator });

  // Data máxima permitida (13 anos atrás da data atual)
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 13));

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  // Validador customizado para conferir senhas
  private passwordMatchValidator(control: AbstractControl) {
    const password = control.get('senha')?.value;
    const confirmPassword = control.get('confirmSenha')?.value;
    return password === confirmPassword ? null : { mismatch: true };
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
      await this.authService.register(formValue).then(() => {
        this.router.navigate(['/login']);
      }).catch(err => {
        console.log(err);
        this.errorMessage = err;
      })
    }
  }

}
