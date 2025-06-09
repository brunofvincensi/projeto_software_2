import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  errorMessage = '';
  form: FormGroup = this.fb.group({
    username: this.fb.control('', Validators.required),
    password: this.fb.control('', Validators.required)
  });

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder) {}

  login() {
    if (this.form.invalid) return;
    const { username, password } = this.form.value;
    this.auth.login(username, password)
    .then(() => {
          this.redirectToUserHome();
        })
    .catch(err => {
      this.errorMessage = err;
    });
  }

	redirectToUserHome() {
		this.router.navigate(['/']);
	}

}
