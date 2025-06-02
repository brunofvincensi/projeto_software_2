import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AdocaoComponent } from './pages/adocao/adocao.component';
import { DesaparecidosComponent } from './pages/desaparecidos/desaparecidos.component';
import { CampanhasComponent } from './pages/campanhas/campanhas.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { CriarAnuncioComponent } from './pages/criar-anuncio/criar-anuncio.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'adocao', component: AdocaoComponent },
  { path: 'desaparecidos', component: DesaparecidosComponent },
  { path: 'campanhas', component: CampanhasComponent },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'criar-anuncio', component: CriarAnuncioComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
