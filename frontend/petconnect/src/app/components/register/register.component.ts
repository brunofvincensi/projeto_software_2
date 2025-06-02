// register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/UserService';
import { UsuarioRegistro, AuthResponse, RegisterFormData } from '../../interfaces/user.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  error = '';
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.createForm();
  }

  ngOnInit(): void {
    // Component initialization logic
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/) // Only letters and spaces
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        this.emailDomainValidator
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^(\(\d{2}\)\s?)?\d{4,5}-?\d{4}$/) // Brazilian phone format
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', [Validators.required]],
      agreedToTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: [this.passwordMatchValidator]
    });
  }

  // Custom validators
  private emailDomainValidator(control: AbstractControl) {
    if (!control.value) return null;

    const email = control.value.toLowerCase();
    const blockedDomains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com'];

    const domain = email.split('@')[1];
    if (blockedDomains.includes(domain)) {
      return { blockedDomain: true };
    }

    return null;
  }

  private passwordStrengthValidator(control: AbstractControl) {
    if (!control.value) return null;

    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const valid = hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;

    if (!valid) {
      return { weakPassword: true };
    }

    return null;
  }

  private passwordMatchValidator(form: AbstractControl) {
    if (!(form instanceof FormGroup)) return null;

    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // Clear the error if passwords match
      const errors = confirmPassword.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
      }
    }

    return null;
  }

  // Utility methods
  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;

    switch (fieldName) {
      case 'name':
        if (errors['required']) return 'Nome é obrigatório';
        if (errors['minlength']) return 'Nome deve ter pelo menos 2 caracteres';
        if (errors['pattern']) return 'Nome deve conter apenas letras e espaços';
        break;

      case 'email':
        if (errors['required']) return 'Email é obrigatório';
        if (errors['email']) return 'Digite um email válido';
        if (errors['blockedDomain']) return 'Este domínio de email não é permitido';
        break;

      case 'phone':
        if (errors['required']) return 'Telefone é obrigatório';
        if (errors['pattern']) return 'Digite um telefone válido (ex: (11) 99999-9999)';
        break;

      case 'password':
        if (errors['required']) return 'Senha é obrigatória';
        if (errors['minlength']) return 'Senha deve ter pelo menos 8 caracteres';
        if (errors['weakPassword']) return 'Senha deve conter ao menos: 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial';
        break;

      case 'confirmPassword':
        if (errors['required']) return 'Confirmação de senha é obrigatória';
        if (errors['passwordMismatch']) return 'Senhas não coincidem';
        break;

      case 'agreedToTerms':
        if (errors['required']) return 'Você deve concordar com os termos';
        break;
    }

    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getPasswordStrength(): string {
    const password = this.registerForm.get('password')?.value || '';
    if (password.length === 0) return '';

    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return 'fraca';
    if (strength <= 3) return 'média';
    if (strength <= 4) return 'boa';
    return 'forte';
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'fraca': return 'strength-weak';
      case 'média': return 'strength-medium';
      case 'boa': return 'strength-good';
      case 'forte': return 'strength-strong';
      default: return '';
    }
  }

  getFormProgress(): number {
    const fields = ['name', 'email', 'phone', 'password', 'confirmPassword', 'agreedToTerms'];
    const validFields = fields.filter(field => {
      const control = this.registerForm.get(field);
      return control && control.valid;
    });

    return Math.round((validFields.length / fields.length) * 100);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const formData = this.registerForm.value as RegisterFormData;

    const userData: UsuarioRegistro = {
      nome: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      phone: formData.phone.replace(/\D/g, ''), // Remove non-digits
      password: formData.password,
      role: 'USER' // Default role for new registrations
    };

    this.userService.register(userData).subscribe({
      next: (response: AuthResponse) => {
        this.handleSuccessfulRegistration(response);
      },
      error: (error: any) => {
        this.handleRegistrationError(error);
      }
    });
  }

  private handleSuccessfulRegistration(response: AuthResponse): void {
    this.loading = false;

    // Handle token storage with fallback
    try {
      if (typeof Storage !== 'undefined') {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        // Fallback for environments without localStorage support
        console.warn('localStorage not available, using session-based authentication');
        // Store in memory or use alternative storage method
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('user', JSON.stringify(response.user));
      }
    } catch (e) {
      console.error('Storage not available:', e);
      // Handle the case where no storage is available
      // You might want to emit an event or use a different approach
    }

    this.router.navigate(['/pets']);
  }

  private handleRegistrationError(error: any): void {
    this.loading = false;

    // Handle specific error types
    if (error.status === 409) {
      this.error = 'Este email já está em uso';
    } else if (error.status === 400) {
      this.error = error.error?.message || 'Dados inválidos fornecidos';
    } else if (error.status === 0) {
      this.error = 'Erro de conexão. Verifique sua internet';
    } else {
      this.error = error.error?.message || 'Erro ao criar conta. Tente novamente';
    }

    console.error('Registration error:', error);
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Method to handle form reset if needed
  resetForm(): void {
    this.registerForm.reset();
    this.error = '';
    this.loading = false;
    this.passwordVisible = false;
    this.confirmPasswordVisible = false;
  }
}
