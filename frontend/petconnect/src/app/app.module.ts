import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AnimaisDesaparecidosComponent } from './animais/animais-desaparecidos/animais-desaparecidos.component';
import { AnimaisDesaparecidosNovoComponent } from './animais/animais-desaparecidos/animais-desaparecidos-novo/animais-desaparecidos-novo.component';
import { AnimaisDoacaoComponent } from './animais/animais-doacao/animais-doacao.component';
import { authInterceptorProvider } from './interceptors/auth.interceptor';
import { UsuarioFormComponent } from './usuario/usuario-form/usuario-form.component';
import { AnimaisDesaparecidosInfoComponent } from './animais/animais-desaparecidos/animais-desaparecidos-info/animais-desaparecidos-info.component';
import { AccessibilityComponent } from './accessibility/accessibility.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    MainLayoutComponent,
    AnimaisDesaparecidosComponent,
    AnimaisDesaparecidosNovoComponent,
    AnimaisDoacaoComponent,
    UsuarioFormComponent,
    AnimaisDesaparecidosInfoComponent,
    AccessibilityComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [authInterceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
